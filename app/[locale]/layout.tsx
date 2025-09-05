import type { Metadata } from 'next'
import Script from 'next/script'
import { GTMHead, GTMBody } from '@/components/gtm-head'
import '@/app/globals.css'
import { baseMetadata, enMetadata } from '@/app/metadata'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-T7BT77WG'
const HUBSPOT_PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '21568098'

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
      <head>
        <GTMHead gtmId={GTM_ID} />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: "'LaHaus Display', system-ui, sans-serif" }}
      >
        <GTMBody gtmId={GTM_ID} />
        {children}
        
        {/* HubSpot Tracking Code */}
        <Script
          id="hs-script-loader"
          strategy="afterInteractive"
          src={`//js.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`}
        />
      </body>
    </html>
  )
}