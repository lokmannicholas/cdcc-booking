import type {
  BusinessHourValue,
  ClinicDefinition,
  LocalizedText,
  RegionCode,
  ServiceDefinition,
  TimePreferenceId,
  TimeSlot
} from './types';
import clinicsData from './clinics.json';

export const services: ServiceDefinition[] = [
  {
    id: 'ecg',
    icon: 'ecg',
    requiresReferral: false,
    name: {
      tc: '預約心電圖',
      sc: '预约心电图',
      en: 'ECG Booking'
    }
  },
  {
    id: 'blood',
    icon: 'blood',
    requiresReferral: true,
    name: {
      tc: '預約抽血服務',
      sc: '预约抽血服务',
      en: 'Blood Test Booking'
    }
  },
  {
    id: 'combo',
    icon: 'combo',
    requiresReferral: true,
    name: {
      tc: '預約心電圖及抽血服務',
      sc: '预约心电图及抽血服务',
      en: 'ECG & Blood Test Booking'
    }
  }
];

interface RawClinicHours {
  monday?: BusinessHourValue;
  tuesday?: BusinessHourValue;
  wednesday?: BusinessHourValue;
  thursday?: BusinessHourValue;
  friday?: BusinessHourValue;
  saturday?: BusinessHourValue;
  sunday?: BusinessHourValue;
}

interface RawClinicDefinition {
  id: string;
  region: RegionCode;
  name: LocalizedText;
  address: LocalizedText;
  phone: string | null;
  bookingHotline?: string | null;
  hours: RawClinicHours;
}

const rawClinics = clinicsData as RawClinicDefinition[];

export const clinics: ClinicDefinition[] = rawClinics.map((clinic) => ({
  id: clinic.id,
  region: clinic.region,
  name: clinic.name,
  address: clinic.address,
  phone: clinic.phone ?? clinic.bookingHotline ?? '',
  hours: {
    weekday: summarizeWeekdayHours(clinic.hours),
    saturday: normalizeBusinessHourValue(clinic.hours.saturday),
    sunday: normalizeBusinessHourValue(clinic.hours.sunday)
  }
}));

const nearbyClinicAlternativeGroups: ReadonlyArray<readonly string[]> = [
  [
    'quality-healthcare-tsing-yi-mtr-station',
    'quality-healthcare-tsing-yi-maritime-square'
  ],
  [
    'quality-healthcare-kowloon-bay-telford',
    'quality-healthcare-kowloon-bay-amoy-plaza'
  ],
  [
    'quality-healthcare-quarry-bay-oxford-house-taikoo-place',
    'quality-healthcare-quarry-bay-devon-house-taikoo-place'
  ]
] as const;

const clinicsById = new Map(clinics.map((clinic) => [clinic.id, clinic]));

export function getNearbyClinicAlternative(clinic: ClinicDefinition): ClinicDefinition | null {
  const matchingGroup = nearbyClinicAlternativeGroups.find((group) => group.includes(clinic.id));

  if (!matchingGroup) {
    return null;
  }

  const alternativeClinicId = matchingGroup.find((clinicId) => clinicId !== clinic.id);

  return alternativeClinicId ? (clinicsById.get(alternativeClinicId) ?? null) : null;
}

function normalizeBusinessHourValue(value: BusinessHourValue | undefined): LocalizedText {
  if (!value) {
    return {
      tc: '休息',
      sc: '休息',
      en: 'Closed'
    };
  }

  if (typeof value === 'string') {
    return {
      tc: value,
      sc: value,
      en: value
    };
  }

  return value;
}

function summarizeWeekdayHours(hours: RawClinicHours): LocalizedText {
  const weekdayValues = [
    hours.monday,
    hours.tuesday,
    hours.wednesday,
    hours.thursday,
    hours.friday
  ].map((value) => normalizeBusinessHourValue(value));

  const allSame = weekdayValues.every(
    (value) =>
      value.tc === weekdayValues[0].tc &&
      value.sc === weekdayValues[0].sc &&
      value.en === weekdayValues[0].en
  );

  if (allSame) {
    return weekdayValues[0];
  }

  return {
    tc: weekdayValues.map((value, index) => `週${index + 1}: ${value.tc}`).join(' / '),
    sc: weekdayValues.map((value, index) => `周${index + 1}: ${value.sc}`).join(' / '),
    en: weekdayValues.map((value, index) => `D${index + 1}: ${value.en}`).join(' / ')
  };
}

export const timeSlots: TimeSlot[] = [
  {
    id: 'morning',
    time: '09:00 - 11:00'
  },
  {
    id: 'afternoon',
    time: '14:30 - 16:30'
  },
  {
    id: 'noPreference',
    time: ''
  }
];

export const initialVisibleMonth = '2026-03-01';
export const defaultAppointmentDate = '2026-03-20';
export const defaultTimePreference: TimePreferenceId = 'morning';
