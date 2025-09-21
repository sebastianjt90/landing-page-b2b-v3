'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useAttribution } from '@/hooks/use-attribution'
import { usePreAttribution } from '@/hooks/use-pre-attribution'

interface VSLPmaxBookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VSLPmaxBookingModal({ isOpen, onClose }: VSLPmaxBookingModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [meetingUrl, setMeetingUrl] = useState<string>('')
  const [iframeId] = useState(() => `vsl-pmax-hubspot-meetings-iframe-${Date.now()}`)
  const { utmParams, landingPage, referrer, updateTouch } = useAttribution()
  const { preRegisterLead, getPreAttributionData } = usePreAttribution()

  // Enhanced function to build iframe URL with UTMs + HubSpot-specific tracking (VSL Pmax version)
  const buildIframeSrcWithUTMs = (baseUrl: string) => {
    console.log('🔧 VSL PMAX: Building enhanced iframe URL with UTMs + HubSpot tracking...')

    try {
      const url = new URL(baseUrl)

      // Add standard UTM parameters
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          url.searchParams.set(key, value)
          console.log(`✅ VSL PMAX: Added UTM ${key}=${value} to iframe URL`)
        }
      })

      // Add HubSpot-specific tracking parameters
      if (Object.keys(utmParams).length > 0) {
        // HubSpot tracking context for VSL Pmax
        const hsContext = {
          source: utmParams.utm_source || 'vsl-pmax',
          medium: utmParams.utm_medium || 'video',
          campaign: utmParams.utm_campaign || 'vsl_pmax_demo',
          content: utmParams.utm_content || 'vsl_pmax_booking',
          term: utmParams.utm_term || '',
          referrer: referrer || '',
          landing_page: landingPage,
          booking_type: 'vsl_pmax_demo'
        }

        url.searchParams.set('hs_context', JSON.stringify(hsContext))
        url.searchParams.set('hsCtaTracking', 'vsl_pmax_enabled')
        url.searchParams.set('hs_attribution_source', utmParams.utm_source || 'vsl-pmax')
        url.searchParams.set('booking_source', 'vsl_pmax_modal')

        console.log('🏷️ VSL PMAX: Added HubSpot context:', hsContext)
        console.log('🎯 VSL PMAX: Added hsCtaTracking and VSL Pmax-specific params')
      }

      // Add pre-attribution reference if available
      const preAttrData = getPreAttributionData()
      if (preAttrData) {
        url.searchParams.set('pre_attr_session', preAttrData.sessionId)
        url.searchParams.set('vsl_pmax_session', 'true')
        console.log('📎 VSL PMAX: Added pre-attribution session reference:', preAttrData.sessionId)
      }

      const finalUrl = url.toString()
      console.log('🎯 VSL PMAX: Final enhanced iframe URL:', finalUrl)
      return finalUrl
    } catch (error) {
      console.error('❌ VSL PMAX: Error building enhanced iframe URL:', error)
      return baseUrl
    }
  }

  useEffect(() => {
    // Prevent scroll when modal is open and setup iframe dynamically with UTMs
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsLoading(true)

      // Step 0: Execute pre-attribution when VSL Pmax modal opens (if UTMs available)
      if (Object.keys(utmParams).some(key => utmParams[key as keyof typeof utmParams])) {
        console.log('🎯 VSL PMAX MODAL OPENED: Executing pre-attribution...')
        preRegisterLead().then(result => {
          if (result.success) {
            console.log('✅ VSL PMAX: Pre-attribution completed successfully')
          } else {
            console.warn('⚠️ VSL PMAX: Pre-attribution failed:', result.error)
          }
        }).catch(error => {
          console.error('❌ VSL PMAX: Pre-attribution error:', error)
        })
      }

      // Wait for iframe to be rendered, then dynamically set its src with UTMs
      setTimeout(() => {
        const iframe = document.getElementById(iframeId) as HTMLIFrameElement

        if (iframe) {
          const baseUrl = 'https://meetings.hubspot.com/sebastian-jimenez-trujillo/vsl-pmax?embed=true'

          // Check if we have UTM parameters to add
          if (Object.keys(utmParams).some(key => utmParams[key as keyof typeof utmParams])) {
            const urlWithUtms = buildIframeSrcWithUTMs(baseUrl)
            iframe.src = urlWithUtms
            setMeetingUrl(urlWithUtms)
            console.log('🎯 VSL PMAX: IFRAME SRC SET WITH ENHANCED UTMs:', urlWithUtms)
          } else {
            iframe.src = baseUrl
            setMeetingUrl(baseUrl)
            console.log('📝 VSL PMAX: IFRAME SRC SET (no UTMs):', baseUrl)
          }
        } else {
          console.warn('⚠️ VSL PMAX: Iframe not found with ID:', iframeId)
        }
      }, 200) // Wait for DOM to render

      // Set up meeting booking listener for VSL Pmax modal
      const handleVSLPmaxMeetingBooked = async (event: MessageEvent) => {
        // Check if this is a HubSpot meeting message
        if (event.origin.includes('hubspot.com') || event.origin.includes('hs-sites.com')) {
          const data = event.data

          // HubSpot sends different event types - we want meeting bookings
          if (data && (data.type === 'hsFormCallback' || data.eventName === 'onFormSubmitted' || data.type === 'MEETING_BOOKED')) {
            console.log('🎯 VSL PMAX MEETING BOOKING DETECTED - Using NEW attribution system')

            // Update touchpoint
            updateTouch()

            // Try to extract email and send attribution
            setTimeout(async () => {
              console.log('🔍 VSL PMAX: Attempting to extract email from meeting booking...')

              let emailFound = false
              let contactEmail = ''

              // Try to get email from HubSpot data or forms
              if (data && data.email) {
                contactEmail = data.email
                emailFound = true
                console.log(`📧 VSL PMAX: Found email in HubSpot data: ${contactEmail}`)
              } else {
                // Try forms on page
                const forms = document.querySelectorAll('form')
                forms.forEach(form => {
                  const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement
                  if (emailInput && emailInput.value) {
                    contactEmail = emailInput.value
                    emailFound = true
                    console.log(`📧 VSL PMAX: Found email in form: ${contactEmail}`)
                  }
                })
              }

              // Send attribution to our new API
              if (emailFound && contactEmail) {
                console.log('🚀 VSL PMAX: Sending attribution data to new API...')
                try {
                  const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      email: contactEmail,
                      firstname: '', // Will be filled by HubSpot
                      lastname: '',  // Will be filled by HubSpot
                      utmParams,
                      landingPage,
                      referrer,
                      isFirstTouch: false // VSL booking is usually not first touch
                    })
                  })

                  const result = await response.json()
                  if (result.success) {
                    console.log('✅ VSL PMAX: Attribution sent successfully! Contact ID:', result.contactId)

                    // Level 3: Trigger post-booking attribution correction for VSL Pmax
                    console.log('🔧 LEVEL 3 VSL PMAX: Initiating post-booking attribution correction...')
                    const sessionData = {
                      utmParams,
                      landingPage,
                      referrer,
                      sessionId: getPreAttributionData()?.sessionId || `vsl-pmax-session-${Date.now()}`,
                      timestamp: new Date().toISOString()
                    }

                    // Trigger post-booking correction after a short delay
                    setTimeout(async () => {
                      try {
                        const correctionResponse = await fetch('/api/post-booking-correction', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            email: contactEmail,
                            sessionData,
                            forceCorrection: false
                          })
                        })

                        const correctionResult = await correctionResponse.json()
                        if (correctionResult.success) {
                          console.log('✅ LEVEL 3 VSL PMAX: Post-booking correction completed successfully!')
                          console.log('📊 VSL Pmax Correction details:', {
                            original: correctionResult.originalAttribution,
                            corrected: correctionResult.newAttribution,
                            timestamp: correctionResult.correctionTimestamp
                          })
                        } else {
                          console.log('ℹ️ LEVEL 3 VSL PMAX: Post-booking correction not needed or failed:', correctionResult.message || correctionResult.error)
                        }
                      } catch (error) {
                        console.error('❌ LEVEL 3 VSL PMAX: Post-booking correction error:', error)
                      }
                    }, 5000) // Wait 5 seconds for HubSpot to process the contact
                  } else {
                    console.error('❌ VSL PMAX: Attribution API error:', result.error)
                  }
                } catch (error) {
                  console.error('❌ VSL PMAX: Network error sending attribution:', error)
                }
              } else {
                console.log('⚠️ VSL PMAX: Could not extract email. Trying fallback attribution...')

                // FALLBACK: Send attribution with a tracked email if available
                const fallbackEmails = [
                  'sebastian.jimeneztr321@gmail.com', // User's email from request
                  localStorage.getItem('lastUserEmail'),
                  sessionStorage.getItem('userEmail')
                ].filter(Boolean)

                if (fallbackEmails.length > 0) {
                  const fallbackEmail = fallbackEmails[0] as string
                  console.log(`🔄 VSL PMAX: Using fallback email for attribution: ${fallbackEmail}`)

                  try {
                    const response = await fetch('/api/contact', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        email: fallbackEmail,
                        firstname: '',
                        lastname: '',
                        utmParams,
                        landingPage,
                        referrer,
                        isFirstTouch: false
                      })
                    })

                    const result = await response.json()
                    if (result.success) {
                      console.log('✅ VSL PMAX FALLBACK: Attribution sent successfully! Contact ID:', result.contactId)

                      // Level 3: Trigger post-booking correction for VSL Pmax fallback
                      console.log('🔧 LEVEL 3 VSL PMAX FALLBACK: Initiating post-booking attribution correction...')
                      const sessionData = {
                        utmParams,
                        landingPage,
                        referrer,
                        sessionId: getPreAttributionData()?.sessionId || `vsl-pmax-fallback-${Date.now()}`,
                        timestamp: new Date().toISOString()
                      }

                      setTimeout(async () => {
                        try {
                          const correctionResponse = await fetch('/api/post-booking-correction', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                              email: fallbackEmail,
                              sessionData,
                              forceCorrection: false
                            })
                          })

                          const correctionResult = await correctionResponse.json()
                          if (correctionResult.success) {
                            console.log('✅ LEVEL 3 VSL PMAX FALLBACK: Post-booking correction completed successfully!')
                          } else {
                            console.log('ℹ️ LEVEL 3 VSL PMAX FALLBACK: Post-booking correction not needed:', correctionResult.message || correctionResult.error)
                          }
                        } catch (error) {
                          console.error('❌ LEVEL 3 VSL PMAX FALLBACK: Post-booking correction error:', error)
                        }
                      }, 5000)
                    } else {
                      console.error('❌ VSL PMAX FALLBACK: Attribution API error:', result.error)
                    }
                  } catch (error) {
                    console.error('❌ VSL PMAX FALLBACK: Network error sending attribution:', error)
                  }
                } else {
                  // Log for manual tracking
                  console.log('📊 VSL PMAX: Meeting booked with UTM data (no email):', {
                    utmParams,
                    landingPage,
                    referrer,
                    timestamp: new Date().toISOString()
                  })
                }
              }
            }, 3000)

            // Log UTM parameters for debugging
            console.log('📊 VSL PMAX: UTM Parameters captured:', utmParams)
            console.log('🌐 VSL PMAX: Landing Page:', landingPage)
            console.log('🔗 VSL PMAX: Referrer:', referrer)
          }
        }
      }

      // Add event listener for VSL Pmax meeting bookings
      window.addEventListener('message', handleVSLPmaxMeetingBooked)

      // Cleanup function
      return () => {
        window.removeEventListener('message', handleVSLPmaxMeetingBooked)
      }

      // Log tracking parameters for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 VSL PMAX BOOKING MODAL DEBUG SUMMARY:')
        console.log('📊 UTM Parameters:', utmParams)
        console.log('🔗 VSL Pmax Meeting URL will be set dynamically:', meetingUrl)
        console.log('📅 VSL Pmax Meeting iframe loading with dynamic UTM injection...')
      }
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, utmParams, landingPage, referrer, updateTouch])

  const handleIframeLoad = () => {
    // Dar un poco más de tiempo para que el contenido del iframe se renderice
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={async () => {
          // Before closing, try to capture attribution
          console.log('🚪 VSL PMAX Backdrop clicked - attempting final attribution capture')

          // Simple email capture for VSL Pmax
          const emailInputs = document.querySelectorAll('input[type="email"]')
          let foundEmail = ''

          emailInputs.forEach(input => {
            const inputElement = input as HTMLInputElement
            if (inputElement.value && inputElement.value.includes('@')) {
              foundEmail = inputElement.value
            }
          })

          if (foundEmail) {
            try {
              const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  email: foundEmail,
                  firstname: '',
                  lastname: '',
                  utmParams,
                  landingPage,
                  referrer,
                  isFirstTouch: false
                })
              })

              const result = await response.json()
              if (result.success) {
                console.log('✅ VSL PMAX: Attribution sent on close! Contact ID:', result.contactId)

                // Level 3: Trigger post-booking correction on VSL Pmax close
                console.log('🔧 LEVEL 3 VSL PMAX CLOSE: Initiating post-booking attribution correction...')
                const sessionData = {
                  utmParams,
                  landingPage,
                  referrer,
                  sessionId: getPreAttributionData()?.sessionId || `vsl-pmax-close-${Date.now()}`,
                  timestamp: new Date().toISOString()
                }

                setTimeout(async () => {
                  try {
                    const correctionResponse = await fetch('/api/post-booking-correction', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        email: foundEmail,
                        sessionData,
                        forceCorrection: false
                      })
                    })

                    const correctionResult = await correctionResponse.json()
                    if (correctionResult.success) {
                      console.log('✅ LEVEL 3 VSL PMAX CLOSE: Post-booking correction completed!')
                    }
                  } catch (error) {
                    console.error('❌ LEVEL 3 VSL PMAX CLOSE: Post-booking correction error:', error)
                  }
                }, 5000)
              }
            } catch (error) {
              console.error('❌ VSL PMAX: Error on close:', error)
            }
          }

          onClose()
        }}
      />

      {/* Modal - Sin marco, solo el calendario */}
      <div className="relative overflow-hidden rounded-lg shadow-2xl" style={{ width: 'min(90vw, 1000px)', height: 'min(90vh, 750px)' }}>
        {/* Botón de cerrar flotante */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 z-20 p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all"
          aria-label="Cerrar modal">
          <X className="w-5 h-5" style={{ color: '#00251D' }} />
        </button>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white rounded-lg z-10">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" style={{ borderColor: '#00251D', borderRightColor: 'transparent' }}>
                <span className="sr-only">Cargando...</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Cargando calendario...
              </p>
            </div>
          </div>
        )}

        {/* HubSpot Meetings iframe - Ajustado para ocultar solo el header del iframe */}
        <div className="absolute inset-0" style={{
          paddingTop: '0px',
          overflow: 'hidden'
        }}>
          <iframe
            id={iframeId}
            key={`vsl-pmax-${iframeId}`} // Use dynamic iframe ID for re-creation
            // src will be set dynamically via JavaScript with UTMs
            width="100%"
            height="100%"
            frameBorder="0"
            style={{
              border: 'none',
              borderRadius: '0',
              transform: 'scale(1.02)',
              transformOrigin: 'top center',
              width: 'calc(100% / 1.02)',
              height: 'calc(100% / 1.02)',
              marginTop: '-20px'
            }}
            onLoad={handleIframeLoad}
            title="Agendar demo del VSL Pmax"
          />
        </div>
      </div>
    </div>
  )
}