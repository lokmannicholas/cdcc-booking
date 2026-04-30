export type Locale = 'tc' | 'sc' | 'en';
export type RegionCode = 'hk' | 'kl' | 'nt' | 'islands';
export type ServiceId = 'ecg' | 'blood' | 'combo';
export type ServiceIcon = ServiceId;
export type TimePreferenceId = 'morning' | 'afternoon' | 'noPreference';
export type StepNumber = 1 | 2 | 3 | 4 | 5;

export type LocalizedText = Record<Locale, string>;
export type BusinessHourValue = string | LocalizedText;

export interface LocaleMetaEntry {
  htmlLang: string;
  shortLabel: string;
}

export interface StepErrors {
  service: string;
  clinic: string;
  schedule: string;
  personal: string;
  nearbyConsent: string;
}

export interface Dictionary {
  browserTitle: string;
  headerTitle: string;
  languageSwitcherLabel: string;
  steps: string[];
  regions: Record<RegionCode, string>;
  back: string;
  next: string;
  submit: string;
  submitting: string;
  agree: string;
  disagree: string;
  gotIt: string;
  serviceTypeTitle: string;
  preferredDateTitle: string;
  preferredDateHint: string;
  preferredTimeTitle: string;
  phoneLabel: string;
  businessHoursLabel: string;
  weekdayLabel: string;
  saturdayLabel: string;
  sundayLabel: string;
  appointmentDateTimeTitle: string;
  personalInfoTitle: string;
  screenshotNote: string;
  nameQuestion: string;
  nameHint: string;
  phoneQuestion: string;
  nearbyQuestion: string;
  nearestQuestion: string;
  referralModalText: string;
  referralDateNote: string;
  morning: string;
  afternoon: string;
  noPreference: string;
  successTitle: string;
  successText: string;
  stepErrors: StepErrors;
  submitError: string;
  noClinics: string;
  calendarWeekdays: string[];
}

export interface ServiceDefinition {
  id: ServiceId;
  icon: ServiceIcon;
  requiresReferral: boolean;
  name: LocalizedText;
}

export interface ClinicHours {
  weekday: BusinessHourValue;
  saturday: BusinessHourValue;
  sunday: BusinessHourValue;
}

export interface ClinicDefinition {
  id: string;
  region: RegionCode;
  name: LocalizedText;
  address: LocalizedText;
  phone: string;
  hours: ClinicHours;
}

export interface TimeSlot {
  id: TimePreferenceId;
  time: string;
}

export interface FormState {
  step: StepNumber;
  serviceId: ServiceId | '';
  region: RegionCode;
  clinicId: string;
  visibleMonth: string;
  appointmentDate: string;
  timePreference: TimePreferenceId;
  name: string;
  phone: string;
  nearbyClinicConsent: boolean | null;
  nearestDateConsent: boolean;
}

export interface CalendarDay {
  key: string;
  date: Date;
  currentMonth: boolean;
  isDisabled: boolean;
}

export type CalendarWeek = CalendarDay[];

export interface SubmissionPayload {
  locale: Locale;
  serviceId: ServiceId;
  clinicId: string;
  appointmentDate: string;
  timePreference: TimePreferenceId;
  customerName: string;
  whatsappPhone: string;
  alternateClinicConsent: boolean;
  nearestDateConsent: boolean;
}
