import type { Metadata } from 'next'
import '@/app/globals.css'
import { baseMetadata, enMetadata } from '@/app/metadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params
  return locale === 'en' ? enMetadata : baseMetadata
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  return (
    <html lang={locale}>
      <body
        className="antialiased"
        style={{ fontFamily: "'LaHaus Display', system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  )
}