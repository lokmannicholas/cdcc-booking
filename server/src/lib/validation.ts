import {
  locales,
  serviceIds,
  timePreferences,
  type Locale,
  type ServiceId,
  type TimePreference,
  type ValidationResult
} from './types';

type JsonRecord = Record<string, unknown>;

const localeSet = new Set<Locale>(locales);
const serviceIdSet = new Set<ServiceId>(serviceIds);
const timePreferenceSet = new Set<TimePreference>(timePreferences);

export function validateSubmission(body: unknown): ValidationResult {
  const errors: string[] = [];
  const source = isRecord(body) ? body : {};

  const locale = cleanString(source.locale ?? 'tc');
  const serviceId = cleanString(source.serviceId);
  const clinicId = cleanString(source.clinicId);
  const appointmentDate = cleanString(source.appointmentDate);
  const timePreference = cleanString(source.timePreference);
  const customerName = cleanString(source.customerName);
  const whatsappPhone = cleanString(source.whatsappPhone);
  const alternateClinicConsent = source.alternateClinicConsent;
  const nearestDateConsent = source.nearestDateConsent;

  if (!localeSet.has(locale as Locale)) {
    errors.push('locale is invalid');
  }

  if (!serviceIdSet.has(serviceId as ServiceId)) {
    errors.push('serviceId is invalid');
  }

  if (!clinicId) {
    errors.push('clinicId is required');
  }

  if (!looksLikeIsoDate(appointmentDate)) {
    errors.push('appointmentDate must be in YYYY-MM-DD format');
  }

  if (!timePreferenceSet.has(timePreference as TimePreference)) {
    errors.push('timePreference is invalid');
  }

  if (customerName.length < 2 || customerName.length > 200) {
    errors.push('customerName must be between 2 and 200 characters');
  }

  if (!looksLikePhoneNumber(whatsappPhone)) {
    errors.push('whatsappPhone must be a valid phone number');
  }

  if (typeof alternateClinicConsent !== 'boolean') {
    errors.push('alternateClinicConsent must be a boolean');
  }

  if (typeof nearestDateConsent !== 'boolean') {
    errors.push('nearestDateConsent must be a boolean');
  }

  return {
    errors,
    value: {
      locale: localeSet.has(locale as Locale) ? (locale as Locale) : 'tc',
      serviceId: serviceIdSet.has(serviceId as ServiceId) ? (serviceId as ServiceId) : 'ecg',
      clinicId,
      appointmentDate,
      timePreference: timePreferenceSet.has(timePreference as TimePreference)
        ? (timePreference as TimePreference)
        : 'morning',
      customerName,
      whatsappPhone,
      alternateClinicConsent: typeof alternateClinicConsent === 'boolean' ? alternateClinicConsent : false,
      nearestDateConsent: typeof nearestDateConsent === 'boolean' ? nearestDateConsent : false
    }
  };
}

export function generateReferenceNo(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  return `QHC-${stamp}`;
}

function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function looksLikeIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function looksLikePhoneNumber(value: string): boolean {
  return /^[0-9+()\-\s]{6,20}$/.test(value);
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null;
}
