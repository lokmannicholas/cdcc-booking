export const serviceIds = ['ecg', 'blood', 'combo'] as const;
export const timePreferences = ['morning', 'afternoon', 'noPreference'] as const;
export const locales = ['tc', 'sc', 'en'] as const;

export type Locale = (typeof locales)[number];
export type ServiceId = (typeof serviceIds)[number];
export type TimePreference = (typeof timePreferences)[number];

export interface SubmissionPayload {
  locale: Locale;
  serviceId: ServiceId;
  clinicId: string;
  appointmentDate: string;
  timePreference: TimePreference;
  customerName: string;
  whatsappPhone: string;
  alternateClinicConsent: boolean;
  nearestDateConsent: boolean;
}

export interface SubmissionRecord extends SubmissionPayload {
  id: string;
  referenceNo: string;
  createdAt: string;
}

export interface ValidationResult {
  errors: string[];
  value: SubmissionPayload;
}
