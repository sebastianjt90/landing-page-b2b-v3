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
        {/* CRITICAL: UTM Capture BEFORE any other scripts */}
        <Script
          id="utm-capture-immediate"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Capture UTMs immediately on page load - BEFORE HubSpot
                var params = new URLSearchParams(window.location.search);
                var utmParams = {};
                var hasUTMs = false;

                // Standard UTM parameters
                var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
                var clickIdKeys = ['gclid', 'fbclid', 'msclkid', 'ttclid', 'li_fat_id'];

                [...utmKeys, ...clickIdKeys].forEach(function(key) {
                  var value = params.get(key);
                  if (value) {
                    utmParams[key] = value;
                    hasUTMs = true;
                  }
                });

                if (hasUTMs) {
                  // Store in localStorage immediately
                  try {
                    localStorage.setItem('hubspot_utm_data', JSON.stringify(utmParams));
                    localStorage.setItem('hubspot_utm_timestamp', Date.now().toString());
                    console.log('🎯 IMMEDIATE UTM CAPTURE:', utmParams);
                  } catch (e) {
                    console.warn('Could not store UTMs in localStorage');
                  }

                  // Set global variable for HubSpot to use
                  window._hsUtmData = utmParams;
                }
              })();
            `,
          }}
        />

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
        
        {/* HubSpot Integration with Pre-captured UTMs */}
        <Script
          id="hubspot-utm-integration"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Initialize HubSpot with pre-captured UTMs
                function initializeHubSpotWithUTMs() {
                  console.log('🔧 Initializing HubSpot with pre-captured UTMs...');

                  // Get UTMs from immediate capture or localStorage
                  var utmParams = window._hsUtmData;

                  if (!utmParams) {
                    try {
                      var stored = localStorage.getItem('hubspot_utm_data');
                      if (stored) {
                        utmParams = JSON.parse(stored);
                        console.log('📦 Retrieved UTMs from localStorage:', utmParams);
                      }
                    } catch (e) {
                      console.warn('Could not retrieve UTMs from localStorage');
                    }
                  }

                  // Set up HubSpot queue with UTMs
                  window._hsq = window._hsq || [];

                  if (utmParams && Object.keys(utmParams).length > 0) {
                    console.log('📡 Setting HubSpot attributes BEFORE tracking loads:', utmParams);

                    // Method 1: Set via _hsq queue BEFORE HubSpot loads
                    window._hsq.push(['setContentType', 'landing-page']);
                    window._hsq.push(['setCanonicalUrl', window.location.href]);

                    // Set UTM parameters directly in the tracking queue
                    Object.keys(utmParams).forEach(function(key) {
                      if (utmParams[key]) {
                        window._hsq.push(['setCustomAttribute', key, utmParams[key]]);
                        console.log('🏷️ Set ' + key + ' = ' + utmParams[key]);
                      }
                    });

                    // Method 2: Also store in global for later access
                    window.hubspotUTMs = utmParams;
                  } else {
                    console.log('📭 No UTMs to set for HubSpot');
                  }
                }

                // Run immediately
                initializeHubSpotWithUTMs();
              })();
            `,
          }}
        />

        {/* HubSpot Tracking Code - Load AFTER UTM setup */}
        <Script
          id="hs-script-loader"
          strategy="afterInteractive"
          src={`https://js.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`}
        />

        {/* Post-HubSpot UTM Integration */}
        <Script
          id="post-hubspot-utm-integration"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function finalizeUTMIntegration() {
                  if (typeof window.hbspt !== 'undefined' && window.hbspt.identify) {
                    var utmParams = window.hubspotUTMs || window._hsUtmData;

                    if (utmParams && Object.keys(utmParams).length > 0) {
                      console.log('🎯 Final HubSpot UTM integration via identify:', utmParams);

                      try {
                        // Use HubSpot identify after it's fully loaded
                        window.hbspt.identify(utmParams);
                        console.log('✅ HubSpot identify() called successfully');

                        // Also try to set page view with UTM context
                        if (window.hbspt.analytics && window.hbspt.analytics.trackPageView) {
                          window.hbspt.analytics.trackPageView({
                            path: window.location.pathname + window.location.search,
                            title: document.title,
                            url: window.location.href
                          });
                          console.log('📊 HubSpot page view tracked with UTM context');
                        }

                      } catch (error) {
                        console.warn('❌ HubSpot identify() failed:', error);
                      }
                    }

                    // Additional: Set up meeting URL preservation
                    window.buildHubSpotMeetingURL = function(baseUrl) {
                      var utms = window.hubspotUTMs || window._hsUtmData;
                      if (utms && Object.keys(utms).length > 0) {
                        var url = new URL(baseUrl);
                        Object.keys(utms).forEach(function(key) {
                          if (utms[key]) {
                            url.searchParams.set(key, utms[key]);
                          }
                        });
                        console.log('🔗 Built meeting URL with UTMs:', url.toString());
                        return url.toString();
                      }
                      return baseUrl;
                    };

                    // Advanced: Try to enhance the hubspotutk cookie with UTM attribution
                    try {
                      var hubspotCookie = document.cookie
                        .split('; ')
                        .find(row => row.startsWith('hubspotutk='));

                      if (hubspotCookie && utmParams && Object.keys(utmParams).length > 0) {
                        console.log('🍪 HubSpot tracking cookie found, enhancing with UTM context');

                        // Store UTM context for HubSpot's internal attribution system
                        if (window.hbspt && window.hbspt.analytics && window.hbspt.analytics.setPath) {
                          var pathWithUTMs = window.location.pathname + window.location.search;
                          window.hbspt.analytics.setPath(pathWithUTMs);
                          console.log('🛤️ Set HubSpot analytics path with UTMs:', pathWithUTMs);
                        }

                        // Try to trigger a re-attribution by forcing a new page context
                        if (window.hbspt && window.hbspt.analytics && window.hbspt.analytics.trackPageView) {
                          setTimeout(function() {
                            window.hbspt.analytics.trackPageView({
                              path: window.location.pathname + window.location.search,
                              title: document.title + ' (UTM Enhanced)',
                              url: window.location.href,
                              contentType: 'landing-page-with-utms'
                            });
                            console.log('🔄 Forced HubSpot page view re-track with enhanced UTM context');
                          }, 500);
                        }
                      }
                    } catch (cookieError) {
                      console.log('🍪 Cookie enhancement not available:', cookieError);
                    }

                  } else {
                    // Retry if HubSpot isn't ready yet
                    setTimeout(finalizeUTMIntegration, 1000);
                  }
                }

                // Wait a bit for HubSpot to fully initialize
                setTimeout(finalizeUTMIntegration, 2000);
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}