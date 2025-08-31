import type { Metadata } from 'next'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'LaHaus AI - B2B Landing Page',
  description: 'AI Assistant for Real Estate',
}

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}