import type { Metadata } from 'next'
import '@/app/globals.css'
import { baseMetadata, enMetadata } from '@/app/metadata'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return params.locale === 'en' ? enMetadata : baseMetadata
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