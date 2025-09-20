import type { Metadata } from 'next'
import Script from 'next/script'
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
      <body
        className="antialiased"
        style={{ fontFamily: "'LaHaus Display', system-ui, sans-serif" }}
      >
        {/* Initialize dataLayer */}
        <Script
          id="gtm-datalayer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];`,
          }}
        />
        
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
        
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        {children}
        
        {/* HubSpot Tracking Code - Changed to afterInteractive for better timing */}
        <Script
          id="hs-script-loader"
          strategy="afterInteractive"
          src={`https://js.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`}
        />

        {/* UTM Capture and HubSpot Integration */}
        <Script
          id="utm-hubspot-integration"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Capture UTMs immediately when page loads
                function captureUTMsOnPageLoad() {
                  // Get UTM parameters from URL
                  const params = new URLSearchParams(window.location.search);
                  const utmParams = {};

                  // Standard UTM parameters
                  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
                  const clickIdKeys = ['gclid', 'fbclid', 'msclkid', 'ttclid', 'li_fat_id'];

                  [...utmKeys, ...clickIdKeys].forEach(key => {
                    const value = params.get(key);
                    if (value) utmParams[key] = value;
                  });

                  // Store UTMs in sessionStorage immediately
                  if (Object.keys(utmParams).length > 0) {
                    try {
                      sessionStorage.setItem('page_utm_params', JSON.stringify(utmParams));
                      console.log('📊 Page Load UTMs captured:', utmParams);
                    } catch (e) {
                      console.warn('Could not store UTMs in sessionStorage');
                    }
                  }
                }

                // Wait for HubSpot to load, then send stored UTMs
                function initUTMTracking() {
                  if (typeof window.hbspt !== 'undefined') {
                    try {
                      const storedUTMs = sessionStorage.getItem('page_utm_params');
                      if (storedUTMs) {
                        const utmParams = JSON.parse(storedUTMs);
                        console.log('📡 Sending stored UTMs to HubSpot:', utmParams);

                        // Try hbspt.identify first
                        if (window.hbspt.identify) {
                          window.hbspt.identify(utmParams);
                        } else if (window._hsq) {
                          window._hsq.push(['identify', utmParams]);
                        }
                      }
                    } catch (error) {
                      console.warn('Error sending UTMs to HubSpot:', error);
                    }
                  } else {
                    setTimeout(initUTMTracking, 500);
                  }
                }

                // Capture UTMs immediately
                captureUTMsOnPageLoad();

                // Start trying to initialize UTM tracking
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', initUTMTracking);
                } else {
                  setTimeout(initUTMTracking, 1000); // Give HubSpot time to load
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}