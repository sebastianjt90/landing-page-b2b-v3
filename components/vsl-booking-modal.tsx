'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { buildMeetingUrlWithCurrentParams, captureTrackingParams, formatTrackingParamsForLog, captureAndSendUTMsToHubSpotAsync } from '@/lib/utm-utils'
import { useAttribution } from '@/hooks/use-attribution'

interface VSLBookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VSLBookingModal({ isOpen, onClose }: VSLBookingModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [meetingUrl, setMeetingUrl] = useState<string>('')
  const { utmParams, landingPage, referrer, updateTouch } = useAttribution()

  useEffect(() => {
    // Prevent scroll when modal is open and build meeting URL with UTMs
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsLoading(true)

      // Build meeting URL with UTM parameters
      const baseUrl = 'https://meetings.hubspot.com/sebastian-jimenez-trujillo/vsl-demo?embed=true'
      const urlWithUtms = buildMeetingUrlWithCurrentParams(baseUrl)
      setMeetingUrl(urlWithUtms)

      // Set up meeting booking listener for VSL modal
      const handleVSLMeetingBooked = async (event: MessageEvent) => {
        // Check if this is a HubSpot meeting message
        if (event.origin.includes('hubspot.com') || event.origin.includes('hs-sites.com')) {
          const data = event.data

          // HubSpot sends different event types - we want meeting bookings
          if (data && (data.type === 'hsFormCallback' || data.eventName === 'onFormSubmitted' || data.type === 'MEETING_BOOKED')) {
            console.log('🎯 VSL MEETING BOOKING DETECTED - Using NEW attribution system')

            // Update touchpoint
            updateTouch()

            // Try to extract email and send attribution
            setTimeout(async () => {
              console.log('🔍 VSL: Attempting to extract email from meeting booking...')

              let emailFound = false
              let contactEmail = ''

              // Try to get email from HubSpot data or forms
              if (data && data.email) {
                contactEmail = data.email
                emailFound = true
                console.log(`📧 VSL: Found email in HubSpot data: ${contactEmail}`)
              } else {
                // Try forms on page
                const forms = document.querySelectorAll('form')
                forms.forEach(form => {
                  const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement
                  if (emailInput && emailInput.value) {
                    contactEmail = emailInput.value
                    emailFound = true
                    console.log(`📧 VSL: Found email in form: ${contactEmail}`)
                  }
                })
              }

              // Send attribution to our new API
              if (emailFound && contactEmail) {
                console.log('🚀 VSL: Sending attribution data to new API...')
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
                    console.log('✅ VSL: Attribution sent successfully! Contact ID:', result.contactId)
                  } else {
                    console.error('❌ VSL: Attribution API error:', result.error)
                  }
                } catch (error) {
                  console.error('❌ VSL: Network error sending attribution:', error)
                }
              } else {
                console.log('⚠️ VSL: Could not extract email. Attribution not sent.')
                // Log for manual tracking
                console.log('📊 VSL: Meeting booked with UTM data (no email):', {
                  utmParams,
                  landingPage,
                  referrer,
                  timestamp: new Date().toISOString()
                })
              }
            }, 3000)

            // Log UTM parameters for debugging
            console.log('📊 VSL: UTM Parameters captured:', utmParams)
            console.log('🌐 VSL: Landing Page:', landingPage)
            console.log('🔗 VSL: Referrer:', referrer)
          }
        }
      }

      // Add event listener for VSL meeting bookings
      window.addEventListener('message', handleVSLMeetingBooked)

      // Cleanup function
      return () => {
        window.removeEventListener('message', handleVSLMeetingBooked)
      }

      // Log tracking parameters for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        const trackingParams = captureTrackingParams()
        console.log('🚀 VSL BOOKING MODAL DEBUG SUMMARY:')
        console.log('📊 UTM Parameters:', formatTrackingParamsForLog(trackingParams))
        console.log('🔗 VSL Meeting URL with UTMs (fallback):', urlWithUtms)
        console.log('📅 VSL Meeting iframe will load next')
      }
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

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
          console.log('🚪 VSL Backdrop clicked - attempting final attribution capture')

          // Simple email capture for VSL
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
                console.log('✅ VSL: Attribution sent on close! Contact ID:', result.contactId)
              }
            } catch (error) {
              console.error('❌ VSL: Error on close:', error)
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
            key={meetingUrl} // Forzar recreación del iframe cuando cambia la URL
            src={meetingUrl || 'https://meetings.hubspot.com/sebastian-jimenez-trujillo/vsl-demo?embed=true'}
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
            title="Agendar demo del VSL"
          />
        </div>
      </div>
    </div>
  )
}