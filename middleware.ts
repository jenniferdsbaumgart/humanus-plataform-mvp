import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // Uma lista de todas as localidades suportadas
  locales: locales,

  // Se essa opção for fornecida, o local padrão será retornado
  // quando não houver correspondência com nenhum dos suportados.
  defaultLocale: 'pt-BR'
});

export const config = {
  // Ignore todos os caminhos iniciados por /api, /_next, etc
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
