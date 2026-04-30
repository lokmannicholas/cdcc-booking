import type { Dictionary, Locale, LocaleMetaEntry } from './types';

export const SUPPORTED_LOCALES = ['tc', 'sc', 'en'] as const;
export const DEFAULT_LOCALE: Locale = 'tc';

export const localeMeta: Record<Locale, LocaleMetaEntry> = {
  tc: {
    htmlLang: 'zh-Hant',
    shortLabel: '繁'
  },
  sc: {
    htmlLang: 'zh-Hans',
    shortLabel: '简'
  },
  en: {
    htmlLang: 'en',
    shortLabel: 'EN'
  }
};

export const dictionaries: Record<Locale, Dictionary> = {
  tc: {
    browserTitle: '預約服務 | Quality HealthCare',
    headerTitle: '預約服務',
    languageSwitcherLabel: '語言',
    steps: ['服務種類', '選擇地點', '選擇時段', '填寫個人資料', '確認資料'],
    regions: {
      hk: '香港島',
      kl: '九龍',
      nt: '新界',
      islands: '離島'
    },
    back: '返回',
    next: '下一步',
    submit: '提交',
    submitting: '提交中...',
    agree: '同意',
    disagree: '不同意',
    gotIt: '知道了',
    serviceTypeTitle: '服務種類',
    preferredDateTitle: '您希望安排的預約日期',
    preferredDateHint: '（星期日及公眾假期除外）',
    preferredTimeTitle: '你心儀的預約時段',
    phoneLabel: '電話號碼',
    businessHoursLabel: '營業時間',
    weekdayLabel: '星期一至五：',
    saturdayLabel: '星期六：',
    sundayLabel: '星期日：',
    appointmentDateTimeTitle: '預約日期及時段',
    personalInfoTitle: '個人資料',
    screenshotNote: '如有需要，請截圖或保存此頁面作為記錄',
    nameQuestion: '請提供您的姓名*',
    nameHint:
      '如果有其它同行者，請一併填寫，例如: 1. Mr Chan Tai Man, 2. Ms Wong Siu Ping',
    phoneQuestion: '請提供可使用WhatsApp的聯絡電話，以便接收確認訊息*',
    nearbyQuestion:
      '若青衣-青衣城診所未能配合我所選擇的日期，會否同意到鄰近的港鐵站診所進行？',
    nearestQuestion: '若未能配合我所選擇的日期，同意由系統安排最接近的預約日期時間',
    referralModalText: '需獲取醫生轉介便條，才可以使用網上預約服務。',
    referralDateNote: '請確保您的檢驗轉介便條的發出日期為2025年11月6日或之後',
    morning: '上午',
    afternoon: '下午',
    noPreference: '沒偏愛時段',
    successTitle: '預約已完成',
    successText: '稍後會有職員聯絡閣下確認預約，敬請留意。',
    stepErrors: {
      service: '請先選擇服務種類。',
      clinic: '請先選擇地點。',
      schedule: '請選擇預約日期及時段。',
      personal: '請填寫姓名及 WhatsApp 電話。',
      nearbyConsent: '請選擇是否同意安排到鄰近診所。'
    },
    submitError: '提交失敗，請稍後再試。',
    noClinics: '此分區暫未提供示範診所。',
    calendarWeekdays: ['日', '一', '二', '三', '四', '五', '六']
  },
  sc: {
    browserTitle: '预约服务 | Quality HealthCare',
    headerTitle: '预约服务',
    languageSwitcherLabel: '语言',
    steps: ['服务种类', '选择地点', '选择时段', '填写个人资料', '确认资料'],
    regions: {
      hk: '香港岛',
      kl: '九龙',
      nt: '新界',
      islands: '离岛'
    },
    back: '返回',
    next: '下一步',
    submit: '提交',
    submitting: '提交中...',
    agree: '同意',
    disagree: '不同意',
    gotIt: '知道了',
    serviceTypeTitle: '服务种类',
    preferredDateTitle: '您希望安排的预约日期',
    preferredDateHint: '（星期日及公众假期除外）',
    preferredTimeTitle: '你心仪的预约时段',
    phoneLabel: '电话号码',
    businessHoursLabel: '营业时间',
    weekdayLabel: '星期一至五：',
    saturdayLabel: '星期六：',
    sundayLabel: '星期日：',
    appointmentDateTimeTitle: '预约日期及时段',
    personalInfoTitle: '个人资料',
    screenshotNote: '如有需要，请截图或保存此页面作为记录',
    nameQuestion: '请提供您的姓名*',
    nameHint:
      '如果有其它同行者，请一并填写，例如: 1. Mr Chan Tai Man, 2. Ms Wong Siu Ping',
    phoneQuestion: '请提供可使用WhatsApp的联络电话，以便接收确认讯息*',
    nearbyQuestion:
      '若青衣-青衣城诊所未能配合我所选择的日期，会否同意到邻近的港铁站诊所进行？',
    nearestQuestion: '若未能配合我所选择的日期，同意由系统安排最接近的预约日期时间',
    referralModalText: '需获取医生转介便条，才可以使用网上预约服务。',
    referralDateNote: '请确保您的检验转介便条的发出日期为2025年11月6日或之后',
    morning: '上午',
    afternoon: '下午',
    noPreference: '没偏爱时段',
    successTitle: '预约已完成',
    successText: '稍后会有职员联络阁下确认预约，敬请留意。',
    stepErrors: {
      service: '请先选择服务种类。',
      clinic: '请先选择地点。',
      schedule: '请选择预约日期及时段。',
      personal: '请填写姓名及 WhatsApp 电话。',
      nearbyConsent: '请选择是否同意安排到邻近诊所。'
    },
    submitError: '提交失败，请稍后再试。',
    noClinics: '此分区暂未提供示范诊所。',
    calendarWeekdays: ['日', '一', '二', '三', '四', '五', '六']
  },
  en: {
    browserTitle: 'Appointment Service | Quality HealthCare',
    headerTitle: 'Appointment Service',
    languageSwitcherLabel: 'Language',
    steps: ['Service Type', 'Choose Location', 'Choose Time', 'Personal Details', 'Confirm Details'],
    regions: {
      hk: 'Hong Kong Island',
      kl: 'Kowloon',
      nt: 'New Territories',
      islands: 'Outlying Islands'
    },
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    submitting: 'Submitting...',
    agree: 'Agree',
    disagree: 'Disagree',
    gotIt: 'Got it',
    serviceTypeTitle: 'Service Type',
    preferredDateTitle: 'Preferred Appointment Date',
    preferredDateHint: '(excluding Sundays and public holidays)',
    preferredTimeTitle: 'Preferred Time Slot',
    phoneLabel: 'Phone',
    businessHoursLabel: 'Business Hours',
    weekdayLabel: 'Mon - Fri:',
    saturdayLabel: 'Sat:',
    sundayLabel: 'Sun:',
    appointmentDateTimeTitle: 'Appointment Date & Time',
    personalInfoTitle: 'Personal Details',
    screenshotNote: 'Please take a screenshot or save this page for your records if needed',
    nameQuestion: 'Please provide your name*',
    nameHint:
      'If there are additional companions, include them together, e.g. 1. Mr Chan Tai Man, 2. Ms Wong Siu Ping',
    phoneQuestion:
      'Please provide a WhatsApp-enabled contact number so we can send a confirmation message*',
    nearbyQuestion:
      'If Tsing Yi - Maritime Square Clinic cannot match your selected date, would you agree to be arranged at a nearby MTR station clinic?',
    nearestQuestion:
      'If your selected date is unavailable, do you agree to let the system arrange the closest available appointment date and time?',
    referralModalText: "A doctor's referral slip is required before online booking can be used.",
    referralDateNote:
      'Please ensure the issue date of your laboratory referral slip is on or after 6 Nov 2025',
    morning: 'Morning',
    afternoon: 'Afternoon',
    noPreference: 'No preference',
    successTitle: 'Booking Completed',
    successText: 'Our staff will contact you shortly to confirm the booking. Please stay tuned.',
    stepErrors: {
      service: 'Please select a service first.',
      clinic: 'Please select a clinic.',
      schedule: 'Please choose a date and time preference.',
      personal: 'Please enter your name and WhatsApp phone number.',
      nearbyConsent: 'Please choose whether you agree to be arranged at a nearby clinic.'
    },
    submitError: 'Submission failed. Please try again later.',
    noClinics: 'No demo clinics are configured for this region yet.',
    calendarWeekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  }
};

export function isSupportedLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

export function getDictionary(locale: string): Dictionary {
  return isSupportedLocale(locale) ? dictionaries[locale] : dictionaries[DEFAULT_LOCALE];
}

export function pickLocalized(
  value: string | Partial<Record<Locale, string>> | null | undefined,
  locale: Locale
): string {
  if (typeof value === 'string') {
    return value;
  }

  if (!value || typeof value !== 'object') {
    return '';
  }

  return value[locale] ?? value[DEFAULT_LOCALE] ?? Object.values(value)[0] ?? '';
}
