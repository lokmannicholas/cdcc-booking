"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import styles from './AppointmentWizard.module.css';
import {
  DEFAULT_LOCALE,
  getDictionary,
  localeMeta,
  pickLocalized
} from '../lib/dictionaries';
import {
  clinics,
  defaultAppointmentDate,
  defaultTimePreference,
  getNearbyClinicAlternative,
  initialVisibleMonth,
  services,
  timeSlots
} from '../lib/qpp-data';
import publicHolidays2026 from '../lib/public-holidays-2026.json';
import type {
  CalendarWeek,
  ClinicDefinition,
  Dictionary,
  FormState,
  Locale,
  RegionCode,
  ServiceDefinition,
  ServiceIcon,
  ServiceId,
  StepNumber,
  SubmissionPayload,
  TimePreferenceId,
  TimeSlot
} from '../lib/types';
import {
  BloodIcon,
  BrandMark,
  CalendarIcon,
  ClockIcon,
  ComboIcon,
  ECGIcon,
  FileDoctorIcon,
  PhoneIcon,
  UserIcon
} from './icons';

const STORAGE_KEY = 'qhc-booking-draft-v1';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
const SUBSCRIPTION_KEY = process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY;
const publicHolidayDates = new Set<string>(publicHolidays2026.dates);

const initialFormState: FormState = {
  step: 1,
  serviceId: '',
  region: 'hk',
  clinicId: '',
  visibleMonth: initialVisibleMonth,
  appointmentDate: defaultAppointmentDate,
  timePreference: defaultTimePreference,
  name: '',
  phone: '',
  nearbyClinicConsent: null,
  nearestDateConsent: true
};

type FormUpdate = Partial<FormState> | ((previous: FormState) => FormState);

interface AppointmentWizardProps {
  locale?: Locale;
}

interface StepperProps {
  steps: string[];
  currentStep: StepNumber;
  submitted: boolean;
}

interface ServiceStepProps {
  locale: Locale;
  selectedServiceId: ServiceId | '';
  onSelect: (serviceId: ServiceId) => void;
}

interface LocationStepProps {
  locale: Locale;
  dictionary: Dictionary;
  region: RegionCode;
  selectedClinicId: string;
  clinicsForRegion: ClinicDefinition[];
  onRegionChange: (region: RegionCode) => void;
  onClinicSelect: (clinicId: string) => void;
}

interface ScheduleStepProps {
  locale: Locale;
  dictionary: Dictionary;
  service: ServiceDefinition | null;
  clinic: ClinicDefinition | null;
  visibleMonthDate: Date;
  weeks: CalendarWeek[];
  selectedDate: string;
  selectedTimePreference: TimePreferenceId;
  onMonthChange: (delta: number) => void;
  onDateSelect: (appointmentDate: string) => void;
  onTimePreferenceSelect: (timePreference: TimePreferenceId) => void;
}

interface PersonalInfoStepProps {
  locale: Locale;
  dictionary: Dictionary;
  form: FormState;
  nearbyQuestion: string | null;
  onChange: (update: FormUpdate) => void;
}

interface ConfirmStepProps {
  locale: Locale;
  dictionary: Dictionary;
  service: ServiceDefinition | null;
  clinic: ClinicDefinition | null;
  appointmentDate: string;
  timeSlot: TimeSlot | null;
  customerName: string;
  phone: string;
}

interface CardProps {
  title: string;
  children?: ReactNode;
}

interface ConsentCardProps {
  question: string;
  agreeLabel: string;
  disagreeLabel: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  name: string;
}

interface HoursBlockProps {
  clinic: ClinicDefinition;
  locale: Locale;
  dictionary: Dictionary;
}

interface SubmissionErrorResponse {
  message?: string;
}

export default function AppointmentWizard({
  locale = DEFAULT_LOCALE
}: AppointmentWizardProps) {
  const t = getDictionary(locale);
  const contentScrollRef = useRef<HTMLDivElement | null>(null);

  const [form, setForm] = useState<FormState>(initialFormState);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stepError, setStepError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [draftReady, setDraftReady] = useState(false);

  const selectedService = useMemo<ServiceDefinition | null>(
    () => services.find((item) => item.id === form.serviceId) ?? null,
    [form.serviceId]
  );

  const selectedClinic = useMemo<ClinicDefinition | null>(
    () => clinics.find((item) => item.id === form.clinicId) ?? null,
    [form.clinicId]
  );

  const regionClinics = useMemo(
    () => clinics.filter((item) => item.region === form.region),
    [form.region]
  );

  const visibleMonthDate = useMemo(
    () => parseDateKey(form.visibleMonth),
    [form.visibleMonth]
  );

  const calendarWeeks = useMemo(
    () => buildCalendar(visibleMonthDate),
    [visibleMonthDate]
  );

  const selectedTimeSlot = useMemo<TimeSlot | null>(
    () => timeSlots.find((item) => item.id === form.timePreference) ?? null,
    [form.timePreference]
  );

  const nearbyClinicAlternative = useMemo(
    () => (selectedClinic ? getNearbyClinicAlternative(selectedClinic) : null),
    [selectedClinic]
  );

  const nearbyQuestion = useMemo(
    () =>
      selectedClinic && nearbyClinicAlternative
        ? buildNearbyQuestion(locale, selectedClinic.name, nearbyClinicAlternative.name)
        : null,
    [locale, nearbyClinicAlternative, selectedClinic]
  );

  useEffect(() => {
    document.documentElement.lang = localeMeta[locale].htmlLang;
    document.title = t.browserTitle;
  }, [locale, t.browserTitle]);

  useEffect(() => {
    try {
      const rawDraft = window.localStorage.getItem(STORAGE_KEY);

      if (rawDraft) {
        const parsedDraft = JSON.parse(rawDraft) as Partial<FormState>;
        setForm((previous) => ({
          ...previous,
          ...parsedDraft
        }));
      }
    } catch (error) {
      console.error('Failed to restore draft', error);
    } finally {
      setDraftReady(true);
    }
  }, []);

  useEffect(() => {
    if (!draftReady || submitted) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch (error) {
      console.error('Failed to persist draft', error);
    }
  }, [draftReady, form, submitted]);

  useEffect(() => {
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [form.step, submitted]);

  const updateForm = (patchOrUpdater: FormUpdate) => {
    setForm((previous) =>
      typeof patchOrUpdater === 'function'
        ? patchOrUpdater(previous)
        : {
            ...previous,
            ...patchOrUpdater
          }
    );
    setStepError('');
    setSubmitError('');
  };

  const handleServiceSelect = (serviceId: ServiceId) => {
    const nextService = services.find((item) => item.id === serviceId);

    updateForm({
      serviceId
    });

    if (nextService?.requiresReferral && nextService.id !== form.serviceId) {
      setShowReferralModal(true);
    }
  };

  const handleRegionSelect = (region: RegionCode) => {
    updateForm((previous) => {
      const currentClinic = clinics.find((item) => item.id === previous.clinicId);
      const keepClinic = currentClinic?.region === region;

      return {
        ...previous,
        region,
        clinicId: keepClinic ? previous.clinicId : '',
        nearbyClinicConsent: keepClinic ? previous.nearbyClinicConsent : null
      };
    });
  };

  const handleMonthChange = (delta: number) => {
    updateForm((previous) => {
      const nextMonthDate = addMonths(parseDateKey(previous.visibleMonth), delta);
      const nextMonthKey = toMonthKey(nextMonthDate);
      const selectedDate = parseDateKey(previous.appointmentDate);

      return {
        ...previous,
        visibleMonth: nextMonthKey,
        appointmentDate: isSameMonth(selectedDate, nextMonthDate)
          ? previous.appointmentDate
          : firstSelectableDate(nextMonthDate)
      };
    });
  };

  const handleNext = () => {
    const error = validateStep(form, t, nearbyQuestion !== null);

    if (error) {
      setStepError(error);
      return;
    }

    updateForm((previous) => ({
      ...previous,
      step: Math.min(previous.step + 1, 5) as StepNumber
    }));
  };

  const handleBack = () => {
    if (form.step === 1) {
      return;
    }

    updateForm((previous) => ({
      ...previous,
      step: Math.max(previous.step - 1, 1) as StepNumber
    }));
  };

  const handleSubmit = async () => {
    const error = validateStep(form, t, nearbyQuestion !== null);

    if (error) {
      setSubmitError(error);
      return;
    }

    if (!selectedService || !selectedClinic) {
      setSubmitError(t.submitError);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const payload: SubmissionPayload = {
      locale,
      serviceId: selectedService.id,
      clinicId: selectedClinic.id,
      appointmentDate: form.appointmentDate,
      timePreference: form.timePreference,
      customerName: form.name.trim(),
      whatsappPhone: form.phone.trim(),
      alternateClinicConsent: form.nearbyClinicConsent ?? false,
      nearestDateConsent: form.nearestDateConsent
    };

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (SUBSCRIPTION_KEY) {
        headers['Ocp-Apim-Subscription-Key'] = SUBSCRIPTION_KEY;
      }

      const response = await fetch(`${API_BASE_URL}/api/submissions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const data = (await response.json().catch(() => null)) as SubmissionErrorResponse | null;

      if (!response.ok) {
        throw new Error(data?.message || t.submitError);
      }

      window.localStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
    } catch (error) {
      console.error('Submission failed', error);
      setSubmitError(error instanceof Error ? error.message : t.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.topBar}>
            <div className={styles.titleBlock}>
              <h1 className={styles.pageTitle}>{t.headerTitle}</h1>
            </div>

            <div className={styles.brandStack}>
              <BrandMark className={styles.brandMark} />
            </div>
          </div>

          <Stepper
            steps={t.steps}
            currentStep={form.step}
            submitted={submitted}
          />
        </div>
      </header>

      <main className={styles.panel}>
        <div ref={contentScrollRef} className={styles.panelScrollArea}>
          {!submitted ? (
            <>
              {stepError ? <div className={styles.messageBar}>{stepError}</div> : null}
              {submitError ? <div className={styles.messageBar}>{submitError}</div> : null}

              <div className={styles.panelBody}>
                {form.step === 1 ? (
                  <ServiceStep
                    locale={locale}
                    selectedServiceId={form.serviceId}
                    onSelect={handleServiceSelect}
                  />
                ) : null}

                {form.step === 2 ? (
                  <LocationStep
                    locale={locale}
                    dictionary={t}
                    region={form.region}
                    selectedClinicId={form.clinicId}
                    clinicsForRegion={regionClinics}
                    onRegionChange={handleRegionSelect}
                    onClinicSelect={(clinicId) => updateForm({ clinicId, nearbyClinicConsent: null })}
                  />
                ) : null}

                {form.step === 3 ? (
                  <ScheduleStep
                    locale={locale}
                    dictionary={t}
                    service={selectedService}
                    clinic={selectedClinic}
                    visibleMonthDate={visibleMonthDate}
                    weeks={calendarWeeks}
                    selectedDate={form.appointmentDate}
                    selectedTimePreference={form.timePreference}
                    onMonthChange={handleMonthChange}
                    onDateSelect={(appointmentDate) => updateForm({ appointmentDate })}
                    onTimePreferenceSelect={(timePreference) => updateForm({ timePreference })}
                  />
                ) : null}

                {form.step === 4 ? (
                  <PersonalInfoStep
                  locale={locale}
                  dictionary={t}
                  form={form}
                  nearbyQuestion={nearbyQuestion}
                  onChange={updateForm}
                />
              ) : null}

                {form.step === 5 ? (
                  <ConfirmStep
                    locale={locale}
                    dictionary={t}
                    service={selectedService}
                    clinic={selectedClinic}
                    appointmentDate={form.appointmentDate}
                    timeSlot={selectedTimeSlot}
                    customerName={form.name}
                    phone={form.phone}
                  />
                ) : null}
              </div>
            </>
          ) : (
            <div className={`${styles.panelBody} ${styles.successStage}`}>
              <div className={styles.successCard}>
                <h2 className={styles.successTitle}>{t.successTitle}</h2>
                <p className={styles.successText}>{t.successText}</p>
              </div>
            </div>
          )}
        </div>

        {!submitted ? (
          <footer className={styles.actionBar}>
            <button type="button" className={styles.secondaryButton} onClick={handleBack}>
              {t.back}
            </button>

            {form.step < 5 ? (
              <button type="button" className={styles.primaryButton} onClick={handleNext}>
                {t.next}
              </button>
            ) : (
              <button
                type="button"
                className={`${styles.primaryButton} ${submitting ? styles.primaryButtonLoading : ''}`}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? t.submitting : t.submit}
              </button>
            )}
          </footer>
        ) : null}
      </main>

      {showReferralModal ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="referral-note">
          <div className={styles.modalCard}>
            <div className={styles.modalIconWrap}>
              <FileDoctorIcon className={styles.modalIcon} />
            </div>
            <p id="referral-note" className={styles.modalText}>
              {t.referralModalText}
            </p>
            <button type="button" className={styles.modalButton} onClick={() => setShowReferralModal(false)}>
              {t.gotIt}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stepper({ steps, currentStep, submitted }: StepperProps) {
  return (
    <ol className={styles.stepper}>
      {steps.map((label, index) => {
        const stepNumber = (index + 1) as StepNumber;
        const status =
          submitted
            ? 'complete'
            : stepNumber < currentStep
              ? 'complete'
              : stepNumber === currentStep
                ? 'current'
                : 'pending';

        return (
          <li key={label} className={`${styles.stepItem} ${styles[status]}`}>
            <div className={styles.stepNode}>
              <span className={styles.stepCircle}>{status === 'complete' ? '✓' : stepNumber}</span>
              <span className={styles.stepLabel}>{label}</span>
            </div>

            {index < steps.length - 1 ? <span className={styles.stepConnector} aria-hidden="true" /> : null}
          </li>
        );
      })}
    </ol>
  );
}

function ServiceStep({ locale, selectedServiceId, onSelect }: ServiceStepProps) {
  return (
    <section className={styles.serviceGrid}>
      {services.map((service) => {
        const selected = selectedServiceId === service.id;

        return (
          <button
            key={service.id}
            type="button"
            className={`${styles.serviceCard} ${selected ? styles.serviceCardSelected : ''}`}
            onClick={() => onSelect(service.id)}
            aria-pressed={selected}
          >
            <div className={styles.cardHeader}>{pickLocalized(service.name, locale)}</div>
            <div className={styles.serviceIconWrap}>
              {renderServiceIcon(service.icon, styles.serviceIconLarge)}
            </div>
          </button>
        );
      })}
    </section>
  );
}

function LocationStep({
  locale,
  dictionary,
  region,
  selectedClinicId,
  clinicsForRegion,
  onRegionChange,
  onClinicSelect
}: LocationStepProps) {
  const regionEntries = Object.entries(dictionary.regions) as Array<[RegionCode, string]>;

  return (
    <section className={styles.locationStage}>
      <div className={styles.regionTabs}>
        {regionEntries.map(([regionCode, label]) => (
          <button
            key={regionCode}
            type="button"
            className={`${styles.regionTab} ${region === regionCode ? styles.regionTabActive : ''}`}
            onClick={() => onRegionChange(regionCode)}
          >
            {label}
          </button>
        ))}
      </div>

      {clinicsForRegion.length ? (
        <div className={styles.clinicGrid}>
          {clinicsForRegion.map((clinic) => {
            const selected = clinic.id === selectedClinicId;

            return (
              <button
                key={clinic.id}
                type="button"
                className={`${styles.clinicCard} ${selected ? styles.clinicCardSelected : ''}`}
                onClick={() => onClinicSelect(clinic.id)}
                aria-pressed={selected}
              >
                <div className={`${styles.clinicHeader} ${selected ? styles.clinicHeaderSelected : ''}`}>
                  {pickLocalized(clinic.name, locale)}
                </div>

                <div className={styles.clinicBody}>
                  <p className={styles.clinicAddress}>{pickLocalized(clinic.address, locale)}</p>
                  <p className={styles.infoLine}>
                    <span className={styles.infoLineLabel}>{dictionary.phoneLabel}:</span> {clinic.phone}
                  </p>

                  <HoursBlock clinic={clinic} locale={locale} dictionary={dictionary} />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>{dictionary.noClinics}</div>
      )}
    </section>
  );
}

function ScheduleStep({
  locale,
  dictionary,
  service,
  clinic,
  visibleMonthDate,
  weeks,
  selectedDate,
  selectedTimePreference,
  onMonthChange,
  onDateSelect,
  onTimePreferenceSelect
}: ScheduleStepProps) {
  return (
    <section className={styles.scheduleLayout}>
      <div className={styles.scheduleSidebar}>
        <DetailCard title={dictionary.serviceTypeTitle}>
          {service ? (
            <div className={styles.serviceSummary}>
              <div className={styles.summaryIconWrap}>{renderServiceIcon(service.icon, styles.summaryIcon)}</div>
              <span className={styles.serviceSummaryText}>{pickLocalized(service.name, locale)}</span>
            </div>
          ) : null}
        </DetailCard>

        {clinic ? (
          <DetailCard title={pickLocalized(clinic.name, locale)}>
            <div className={styles.detailClinicCard}>
              <p className={styles.clinicAddress}>{pickLocalized(clinic.address, locale)}</p>
              <p className={styles.infoLine}>
                <span className={styles.infoLineLabel}>{dictionary.phoneLabel}:</span> {clinic.phone}
              </p>
              <HoursBlock clinic={clinic} locale={locale} dictionary={dictionary} />
            </div>
          </DetailCard>
        ) : null}

        <p className={styles.warningText}>
          **{dictionary.referralDateNote}**
        </p>
      </div>

      <div className={styles.scheduleMain}>
        <div className={styles.calendarCard}>
          <div className={styles.calendarTitleBar}>
            <span>{dictionary.preferredDateTitle}</span>
            <span className={styles.calendarHint}>{dictionary.preferredDateHint}</span>
          </div>

          <div className={styles.calendarMonthBar}>
            <button
              type="button"
              className={styles.monthButton}
              onClick={() => onMonthChange(-1)}
              aria-label="Previous month"
            >
              ‹
            </button>

            <div className={styles.monthLabel}>{formatMonthTitle(visibleMonthDate, locale)}</div>

            <button
              type="button"
              className={styles.monthButton}
              onClick={() => onMonthChange(1)}
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className={styles.calendarGrid}>
            {dictionary.calendarWeekdays.map((weekday) => (
              <div key={weekday} className={styles.calendarWeekday}>
                {weekday}
              </div>
            ))}

            {weeks.flat().map((day) => {
              const selected = day.key === selectedDate;
              const disabled = !day.currentMonth || day.isDisabled;

              return (
                <button
                  key={day.key}
                  type="button"
                  className={[
                    styles.calendarDay,
                    !day.currentMonth ? styles.calendarDayMuted : '',
                    disabled ? styles.calendarDayDisabled : '',
                    selected ? styles.calendarDaySelected : ''
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    if (!disabled) {
                      onDateSelect(day.key);
                    }
                  }}
                  disabled={disabled}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <DetailCard title={dictionary.preferredTimeTitle}>
          <div className={styles.timeGrid}>
            {timeSlots.map((slot) => {
              const selected = slot.id === selectedTimePreference;
              const timeLabel =
                slot.id === 'morning'
                  ? dictionary.morning
                  : slot.id === 'afternoon'
                    ? dictionary.afternoon
                    : dictionary.noPreference;

              return (
                <label
                  key={slot.id}
                  className={`${styles.radioCard} ${selected ? styles.radioCardSelected : ''}`}
                >
                  <input
                    type="radio"
                    name="preferredTime"
                    checked={selected}
                    onChange={() => onTimePreferenceSelect(slot.id)}
                    className={styles.visuallyHidden}
                  />
                  <span className={styles.radioDot} aria-hidden="true" />
                  <span className={styles.radioText}>
                    <strong>{timeLabel}</strong>
                    {slot.time ? <span className={styles.radioMeta}>{slot.time}</span> : null}
                  </span>
                </label>
              );
            })}
          </div>
        </DetailCard>
      </div>
    </section>
  );
}

function PersonalInfoStep({ locale, dictionary, form, nearbyQuestion, onChange }: PersonalInfoStepProps) {
  return (
    <section className={styles.formStack}>
      <div className={styles.formCard}>
        <div className={styles.formIntro}>
          <h2 className={styles.formLabel}>{dictionary.nameQuestion}</h2>
          <p className={styles.formHint}>{dictionary.nameHint}</p>
        </div>

        <textarea
          className={styles.formInput}
          value={form.name}
          onChange={(event) => onChange({ name: event.target.value })}
          aria-label={dictionary.nameQuestion}
          placeholder={locale === 'en' ? 'e.g. CHAN Tai Man, Wong Siu Ping' : ''}
        />
      </div>

      <div className={styles.formCard}>
        <div className={styles.formIntro}>
          <h2 className={styles.formLabel}>{dictionary.phoneQuestion}</h2>
        </div>

        <input
          className={styles.formInput}
          type="tel"
          inputMode="tel"
          value={form.phone}
          onChange={(event) => onChange({ phone: event.target.value })}
          aria-label={dictionary.phoneQuestion}
          placeholder={locale === 'en' ? 'e.g. 9921 6638' : ''}
        />
      </div>

      {nearbyQuestion ? (
        <ConsentCard
          question={nearbyQuestion}
          agreeLabel={dictionary.agree}
          disagreeLabel={dictionary.disagree}
          value={form.nearbyClinicConsent}
          onChange={(value) => onChange({ nearbyClinicConsent: value })}
          name="nearbyClinicConsent"
        />
      ) : null}

      <ConsentCard
        question={dictionary.nearestQuestion}
        agreeLabel={dictionary.agree}
        disagreeLabel={dictionary.disagree}
        value={form.nearestDateConsent}
        onChange={(value) => onChange({ nearestDateConsent: value })}
        name="nearestDateConsent"
      />
    </section>
  );
}

function ConfirmStep({
  locale,
  dictionary,
  service,
  clinic,
  appointmentDate,
  timeSlot,
  customerName,
  phone
}: ConfirmStepProps) {
  return (
    <section className={styles.confirmLayout}>
      <div className={styles.outlineNote}>{dictionary.screenshotNote}</div>

      <div className={styles.summaryGrid}>
        <SummaryCard title={dictionary.serviceTypeTitle}>
          {service ? (
            <div className={styles.summaryInline}>
              <div className={styles.summaryIconWrap}>
                {renderServiceIcon(service.icon, styles.summaryIconSmall)}
              </div>
              <span className={styles.summaryStrong}>{pickLocalized(service.name, locale)}</span>
            </div>
          ) : null}
        </SummaryCard>

        <SummaryCard title={dictionary.appointmentDateTimeTitle}>
          <div className={styles.dateTimeStack}>
            <div className={styles.summaryInline}>
              <CalendarIcon className={styles.summaryUtilityIcon} />
              <span className={styles.summaryStrong}>{formatDisplayDate(appointmentDate, locale)}</span>
            </div>

            <div className={styles.summaryInline}>
              <ClockIcon className={styles.summaryUtilityIcon} />
              <span className={styles.summaryStrong}>
                {timeSlot?.time || timeLabelFromId(timeSlot?.id, dictionary)}
              </span>
            </div>
          </div>
        </SummaryCard>

        <SummaryCard title={clinic ? pickLocalized(clinic.name, locale) : ''}>
          {clinic ? (
            <div>
              <p className={styles.clinicAddress}>{pickLocalized(clinic.address, locale)}</p>
              <p className={styles.infoLine}>
                <span className={styles.infoLineLabel}>{dictionary.phoneLabel}:</span> {clinic.phone}
              </p>
              <HoursBlock clinic={clinic} locale={locale} dictionary={dictionary} />
            </div>
          ) : null}
        </SummaryCard>

        <SummaryCard title={dictionary.personalInfoTitle}>
          <div className={styles.personalSummary}>
            <div className={styles.summaryInline}>
              <UserIcon className={styles.summaryUtilityIcon} />
              <span className={styles.summaryStrong}>{customerName}</span>
            </div>

            <div className={styles.summaryInline}>
              <PhoneIcon className={styles.summaryUtilityIcon} />
              <span className={styles.summaryStrong}>{phone}</span>
            </div>
          </div>
        </SummaryCard>
      </div>
    </section>
  );
}

function DetailCard({ title, children }: CardProps) {
  return (
    <section className={styles.detailCard}>
      <div className={styles.detailCardHeader}>{title}</div>
      <div className={styles.detailCardBody}>{children}</div>
    </section>
  );
}

function SummaryCard({ title, children }: CardProps) {
  return (
    <section className={styles.summaryCard}>
      <div className={styles.summaryCardHeader}>{title}</div>
      <div className={styles.summaryCardBody}>{children}</div>
    </section>
  );
}

function ConsentCard({
  question,
  agreeLabel,
  disagreeLabel,
  value,
  onChange,
  name
}: ConsentCardProps) {
  return (
    <div className={styles.formCard}>
      <div className={styles.formIntro}>
        <h2 className={styles.formLabel}>{question}</h2>
      </div>

      <div className={styles.choiceOptions}>
        <label className={`${styles.choiceOption} ${value === true ? styles.choiceOptionActive : ''}`}>
          <input
            type="radio"
            name={name}
            checked={value === true}
            onChange={() => onChange(true)}
            className={styles.visuallyHidden}
          />
          <span className={styles.radioDot} aria-hidden="true" />
          <span>{agreeLabel}</span>
        </label>

        <label className={`${styles.choiceOption} ${value === false ? styles.choiceOptionActive : ''}`}>
          <input
            type="radio"
            name={name}
            checked={value === false}
            onChange={() => onChange(false)}
            className={styles.visuallyHidden}
          />
          <span className={styles.radioDot} aria-hidden="true" />
          <span>{disagreeLabel}</span>
        </label>
      </div>
    </div>
  );
}

function HoursBlock({ clinic, locale, dictionary }: HoursBlockProps) {
  return (
    <div className={styles.hoursBlock}>
      <div className={styles.hoursTitle}>{dictionary.businessHoursLabel}</div>
      <div className={styles.hoursDivider} />

      <div className={styles.hoursTable}>
        <span className={styles.hoursKey}>{dictionary.weekdayLabel}</span>
        <span className={styles.hoursValue}>{pickLocalized(clinic.hours.weekday, locale)}</span>

        <span className={styles.hoursKey}>{dictionary.saturdayLabel}</span>
        <span className={styles.hoursValue}>{pickLocalized(clinic.hours.saturday, locale)}</span>

        <span className={styles.hoursKey}>{dictionary.sundayLabel}</span>
        <span className={styles.hoursValue}>{pickLocalized(clinic.hours.sunday, locale)}</span>
      </div>
    </div>
  );
}

function renderServiceIcon(icon: ServiceIcon, className?: string) {
  switch (icon) {
    case 'ecg':
      return <ECGIcon className={className} />;
    case 'blood':
      return <BloodIcon className={className} />;
    case 'combo':
      return <ComboIcon className={className} />;
    default:
      return null;
  }
}

function validateStep(form: FormState, dictionary: Dictionary, requiresNearbyConsent: boolean): string {
  if (form.step === 1 && !form.serviceId) {
    return dictionary.stepErrors.service;
  }

  if (form.step === 2 && !form.clinicId) {
    return dictionary.stepErrors.clinic;
  }

  if (
    form.step === 3 &&
    (
      !form.appointmentDate ||
      !form.timePreference ||
      isBookingDisabledDate(parseDateKey(form.appointmentDate))
    )
  ) {
    return dictionary.stepErrors.schedule;
  }

  if (form.step >= 4 && (!form.name.trim() || !form.phone.trim())) {
    return dictionary.stepErrors.personal;
  }

  if (form.step >= 4 && requiresNearbyConsent && form.nearbyClinicConsent === null) {
    return dictionary.stepErrors.nearbyConsent;
  }

  return '';
}

function buildNearbyQuestion(
  locale: Locale,
  clinicName: ClinicDefinition['name'],
  nearbySiteName: ClinicDefinition['name']
): string {
  const fullClinicName = toClinicQuestionLabel(pickLocalized(clinicName, locale));
  const nearbyLabel = toClinicQuestionLabel(pickLocalized(nearbySiteName, locale));

  if (locale === 'en') {
    return `If ${fullClinicName} Clinic cannot match your selected date, would you agree to be arranged at the nearby ${nearbyLabel} Clinic?`;
  }

  if (locale === 'sc') {
    return `若${fullClinicName}诊所未能配合我所选择的日期，会否同意到邻近的${nearbyLabel}诊所进行？`;
  }

  return `若${fullClinicName}診所未能配合我所選擇的日期，會否同意到鄰近的${nearbyLabel}診所進行？`;
}

function toClinicQuestionLabel(value: string): string {
  const match = value.match(/\(([^()]+)\)/);
  return match?.[1]?.trim() || value;
}

function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
}

function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function isSameMonth(firstDate: Date, secondDate: Date): boolean {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth()
  );
}

function firstSelectableDate(monthDate: Date): string {
  const cursor = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);

  while (isBookingDisabledDate(cursor)) {
    cursor.setDate(cursor.getDate() + 1);
  }

  return toDateKey(cursor);
}

function buildCalendar(monthDate: Date): CalendarWeek[] {
  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

  const firstCellDate = new Date(monthStart);
  firstCellDate.setDate(firstCellDate.getDate() - monthStart.getDay());

  const weeks: CalendarWeek[] = [];
  const cursor = new Date(firstCellDate);

  for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
    const days: CalendarWeek = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const date = new Date(cursor);

      days.push({
        key: toDateKey(date),
        date,
        currentMonth: date.getMonth() === monthDate.getMonth(),
        isDisabled: isBookingDisabledDate(date)
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    weeks.push(days);

    if (cursor > monthEnd && cursor.getDay() === 0) {
      break;
    }
  }

  return weeks;
}

function isBookingDisabledDate(date: Date): boolean {
  const dayOfWeek = date.getDay();

  return dayOfWeek === 0 || dayOfWeek === 6 || publicHolidayDates.has(toDateKey(date));
}

function formatMonthTitle(date: Date, locale: Locale): string {
  if (locale === 'en') {
    return new Intl.DateTimeFormat('en', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  return `${date.getFullYear()}年 | ${date.getMonth() + 1}月`;
}

function formatDisplayDate(dateKey: string, locale: Locale): string {
  const date = parseDateKey(dateKey);

  if (locale === 'en') {
    return new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function timeLabelFromId(id: TimePreferenceId | undefined, dictionary: Dictionary): string {
  if (id === 'morning') {
    return dictionary.morning;
  }

  if (id === 'afternoon') {
    return dictionary.afternoon;
  }

  return dictionary.noPreference;
}
