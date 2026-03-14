import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['pt-BR', 'en-GB'];

export default getRequestConfig(async ({ locale }) => {
  // Verifique se o locale está suportado
  if (!locales.includes(locale as any)) notFound();

  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
