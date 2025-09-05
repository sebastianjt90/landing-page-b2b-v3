import type { Metadata } from 'next'
import Script from 'next/script'
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/google-tag-manager'
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
        <Script
          id="gtm-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                'gtm.start': new Date().getTime(),
                'event': 'gtm.js'
              });
            `,
          }}
        />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: "'LaHaus Display', system-ui, sans-serif" }}
      >
        {/* Google Tag Manager */}
        <GoogleTagManager gtmId={GTM_ID} />
        {/* Google Tag Manager (noscript) */}
        <GoogleTagManagerNoScript gtmId={GTM_ID} />
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