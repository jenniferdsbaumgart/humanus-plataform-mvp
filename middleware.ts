import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Lista de localidades suportadas
  locales: ['pt-BR', 'en-GB'],

  // Localidade padrão
  defaultLocale: 'pt-BR',
  
  // Garante que o locale sempre apareça na URL
  localePrefix: 'always'
});

export const config = {
  // Ignorar arquivos estáticos e APIs
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
