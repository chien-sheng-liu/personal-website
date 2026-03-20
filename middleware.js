import { NextResponse } from 'next/server';

function pickLangFromAcceptLanguage(header) {
  const h = (header || '').toLowerCase();
  if (h.includes('zh-tw') || h.includes('zh-hant') || h.includes('zh')) return 'zh';
  if (h.includes('en')) return 'en';
  return 'zh';
}

export function middleware(request) {
  const { nextUrl, cookies } = request;
  const { pathname } = nextUrl;

  // Skip Next.js internals, API routes, and static assets
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || /\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // Respect explicit locale prefixes
  if (pathname.startsWith('/en')) {
    return NextResponse.next();
  }

  // Only apply redirect for paths without locale prefix
  const cookieLang = cookies.get('preferred-lang')?.value;
  const acceptLang = request.headers.get('accept-language');
  const lang = cookieLang || pickLangFromAcceptLanguage(acceptLang);

  if (lang === 'zh') {
    return NextResponse.next();
  }

  const url = nextUrl.clone();
  url.pathname = `/${lang}${pathname}`;
  const res = NextResponse.redirect(url);
  res.cookies.set('preferred-lang', lang, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  return res;
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
