import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/expenses', '/budget', '/goals', '/settings', '/learn', '/finguru'];
const PUBLIC_API_ROUTES = ['/api/auth/signup', '/api/auth/login', '/api/auth/logout'];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Allow static files and Next.js internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Allow public API routes
  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow public pages
  const publicPages = ['/login', '/signup', '/forgot-password', '/', '/onboarding'];
  if (publicPages.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('pw_token')?.value;

  // Protect pages
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect other API routes
  if (pathname.startsWith('/api/') && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
