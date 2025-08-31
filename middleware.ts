import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'es']
const defaultLocale = 'es'

function getLocale(request: NextRequest): string {
  // Check if there's a locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  if (pathnameHasLocale) {
    return pathname.split('/')[1]
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language') || ''
  
  // Simple language detection - check if Spanish is preferred
  if (acceptLanguage.toLowerCase().includes('es')) {
    return 'es'
  }
  
  // Default to English for all other languages
  return 'en'
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Check if there's already a locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale) {
    // Redirect to the locale-prefixed path
    const locale = getLocale(request)
    const newUrl = new URL(`/${locale}${pathname}`, request.url)
    
    // Preserve query parameters
    newUrl.search = request.nextUrl.search
    
    return NextResponse.redirect(newUrl)
  }
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|integrations|whatsapp.svg|assets).*)',
  ],
}