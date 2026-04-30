import { notFound } from 'next/navigation';
import AppointmentWizard from '../../components/AppointmentWizard';
import { SUPPORTED_LOCALES, isSupportedLocale } from '../../lib/dictionaries';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

interface LocalePageProps {
  params: {
    locale: string;
  };
}

export default function LocalePage({ params }: LocalePageProps) {
  const { locale } = params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <AppointmentWizard locale={locale} />;
}
