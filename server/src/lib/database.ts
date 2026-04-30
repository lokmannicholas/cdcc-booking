import sql from 'mssql';
import { randomUUID } from 'node:crypto';
import { type SubmissionPayload, type SubmissionRecord } from './types';
import { generateReferenceNo } from './validation';

let poolPromise: Promise<sql.ConnectionPool> | undefined;

export async function listSubmissions(): Promise<SubmissionRecord[]> {
  const pool = await getPool();
  const schema = getSqlSchema();
  const result = await pool.request().query(`
    SELECT
      CONVERT(varchar(36), Id) AS id,
      ReferenceNo AS referenceNo,
      CONVERT(varchar(33), CreatedAt, 127) AS createdAt,
      Locale AS locale,
      ServiceId AS serviceId,
      ClinicId AS clinicId,
      CONVERT(char(10), AppointmentDate, 23) AS appointmentDate,
      TimePreference AS timePreference,
      CustomerName AS customerName,
      WhatsappPhone AS whatsappPhone,
      AlternateClinicConsent AS alternateClinicConsent,
      NearestDateConsent AS nearestDateConsent
    FROM ${schema}.BookingSubmission
    ORDER BY CreatedAt DESC;
  `);

  return result.recordset.map(normalizeSubmissionRecord);
}

export async function createSubmission(payload: SubmissionPayload): Promise<SubmissionRecord> {
  const pool = await getPool();
  const schema = getSqlSchema();
  const id = randomUUID();
  const referenceNo = generateReferenceNo();
  const createdAt = new Date().toISOString();

  const result = await pool
    .request()
    .input('id', sql.UniqueIdentifier, id)
    .input('referenceNo', sql.NVarChar(32), referenceNo)
    .input('createdAt', sql.DateTimeOffset, createdAt)
    .input('locale', sql.NVarChar(8), payload.locale)
    .input('serviceId', sql.NVarChar(32), payload.serviceId)
    .input('clinicId', sql.NVarChar(128), payload.clinicId)
    .input('appointmentDate', sql.NVarChar(10), payload.appointmentDate)
    .input('timePreference', sql.NVarChar(32), payload.timePreference)
    .input('customerName', sql.NVarChar(200), payload.customerName)
    .input('whatsappPhone', sql.NVarChar(32), payload.whatsappPhone)
    .input('alternateClinicConsent', sql.Bit, payload.alternateClinicConsent)
    .input('nearestDateConsent', sql.Bit, payload.nearestDateConsent)
    .query(`
      INSERT INTO ${schema}.BookingSubmission
      (
        Id,
        ReferenceNo,
        CreatedAt,
        Locale,
        ServiceId,
        ClinicId,
        AppointmentDate,
        TimePreference,
        CustomerName,
        WhatsappPhone,
        AlternateClinicConsent,
        NearestDateConsent
      )
      OUTPUT
        CONVERT(varchar(36), INSERTED.Id) AS id,
        INSERTED.ReferenceNo AS referenceNo,
        CONVERT(varchar(33), INSERTED.CreatedAt, 127) AS createdAt,
        INSERTED.Locale AS locale,
        INSERTED.ServiceId AS serviceId,
        INSERTED.ClinicId AS clinicId,
        CONVERT(char(10), INSERTED.AppointmentDate, 23) AS appointmentDate,
        INSERTED.TimePreference AS timePreference,
        INSERTED.CustomerName AS customerName,
        INSERTED.WhatsappPhone AS whatsappPhone,
        INSERTED.AlternateClinicConsent AS alternateClinicConsent,
        INSERTED.NearestDateConsent AS nearestDateConsent
      VALUES
      (
        @id,
        @referenceNo,
        @createdAt,
        @locale,
        @serviceId,
        @clinicId,
        CAST(@appointmentDate AS date),
        @timePreference,
        @customerName,
        @whatsappPhone,
        @alternateClinicConsent,
        @nearestDateConsent
      );
    `);

  const record = result.recordset[0];

  if (!record) {
    throw new Error('Insert did not return a submission record');
  }

  return normalizeSubmissionRecord(record);
}

async function getPool(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    const connectionString = process.env.SQL_CONNECTION_STRING;
    poolPromise = connectionString
      ? sql.connect(connectionString)
      : sql.connect({
          server: getRequiredSetting('SQL_SERVER'),
          database: getRequiredSetting('SQL_DATABASE'),
          user: getRequiredSetting('SQL_USER'),
          password: getRequiredSetting('SQL_PASSWORD'),
          port: Number(process.env.SQL_PORT || 1433),
          options: {
            encrypt: (process.env.SQL_ENCRYPT || 'true').toLowerCase() !== 'false',
            trustServerCertificate: (process.env.SQL_TRUST_SERVER_CERTIFICATE || 'false').toLowerCase() === 'true'
          }
        });
  }

  return poolPromise;
}

function getRequiredSetting(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required app setting: ${name}`);
  }

  return value;
}

function getSqlSchema(): string {
  const schema = process.env.SQL_SCHEMA || 'dbo';

  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(schema)) {
    throw new Error('SQL_SCHEMA must contain only letters, digits, and underscores');
  }

  return `[${schema}]`;
}

function normalizeSubmissionRecord(record: Record<string, unknown>): SubmissionRecord {
  return {
    id: String(record.id),
    referenceNo: String(record.referenceNo),
    createdAt: String(record.createdAt),
    locale: String(record.locale) as SubmissionRecord['locale'],
    serviceId: String(record.serviceId) as SubmissionRecord['serviceId'],
    clinicId: String(record.clinicId),
    appointmentDate: String(record.appointmentDate),
    timePreference: String(record.timePreference) as SubmissionRecord['timePreference'],
    customerName: String(record.customerName),
    whatsappPhone: String(record.whatsappPhone),
    alternateClinicConsent: Boolean(record.alternateClinicConsent),
    nearestDateConsent: Boolean(record.nearestDateConsent)
  };
}
