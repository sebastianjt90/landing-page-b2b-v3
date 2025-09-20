'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { translations } from '@/lib/translations'
import { buildMeetingUrlWithCurrentParams, captureTrackingParams, formatTrackingParamsForLog, debugUTMCapture, captureAndSendUTMsToHubSpotAsync, scheduleDelayedAttribution } from '@/lib/utm-utils'

// Global function type declaration
declare global {
    interface Window {
        buildHubSpotMeetingURL?: (baseUrl: string) => string
    }
}

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
    locale?: string
}

export function BookingModal({ isOpen, onClose, locale = 'es' }: BookingModalProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [meetingUrl, setMeetingUrl] = useState<string>('')
    const t = translations[locale as keyof typeof translations] || translations.es

    useEffect(() => {
        // Prevent scroll when modal is open and build meeting URL with UTMs
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            setIsLoading(true)

            // Step 1: Build meeting URL with UTM parameters using global function
            const baseUrl = t.booking.meetingUrl
            let urlWithUtms = baseUrl

            // Use the global HubSpot meeting URL builder if available
            if (typeof window.buildHubSpotMeetingURL === 'function') {
                urlWithUtms = window.buildHubSpotMeetingURL(baseUrl)
                console.log('🌐 Using global HubSpot meeting URL builder')
            } else {
                // Fallback to original method
                urlWithUtms = buildMeetingUrlWithCurrentParams(baseUrl)
                console.log('🔄 Using fallback meeting URL builder')
            }

            setMeetingUrl(urlWithUtms)

            // Step 2: Set up HubSpot meeting event listener for when booking actually happens
            const handleMeetingBooked = (event: MessageEvent) => {
                // Check if this is a HubSpot meeting message
                if (event.origin.includes('hubspot.com') || event.origin.includes('hs-sites.com')) {
                    const data = event.data

                    // HubSpot sends different event types - we want meeting bookings
                    if (data && (data.type === 'hsFormCallback' || data.eventName === 'onFormSubmitted' || data.type === 'MEETING_BOOKED')) {
                        console.log('🎯 MEETING BOOKING DETECTED - Sending UTMs to HubSpot NOW')

                        // OLD METHOD: Send UTMs to HubSpot (doesn't work for attribution)
                        captureAndSendUTMsToHubSpotAsync().then(trackingSent => {
                            console.log(`📡 Meeting Booked - HubSpot Tracking Result: ${trackingSent ? 'SUCCESS ✅' : 'FAILED ❌'}`)
                        })

                        // NEW METHOD: Schedule delayed attribution via backend API
                        // This will extract email from the meeting booking and send proper attribution
                        setTimeout(() => {
                            console.log('🔍 Attempting to extract email for delayed attribution...')

                            // Try to get email from HubSpot forms if available
                            const forms = document.querySelectorAll('form')
                            let emailFound = false

                            forms.forEach(form => {
                                const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement
                                if (emailInput && emailInput.value) {
                                    console.log(`📧 Found email for attribution: ${emailInput.value}`)
                                    scheduleDelayedAttribution(emailInput.value, 15)
                                    emailFound = true
                                }
                            })

                            // Alternative: Try to get email from iframe content if accessible
                            if (!emailFound) {
                                console.log('⚠️ Could not extract email from forms. Scheduling generic delayed attribution.')
                                // This will attempt to find the contact by other means
                                scheduleDelayedAttribution('unknown@email.com', 30)
                            }
                        }, 2000)

                        // Also try to update the contact directly via HubSpot forms API
                        const trackingParams = captureTrackingParams()
                        if (window.hbspt && window.hbspt.forms && Object.keys(trackingParams).length > 0) {
                            console.log('📝 Updating HubSpot contact properties with UTM data')
                            try {
                                // Create a hidden form submission to update contact properties
                                window.hbspt.forms.create({
                                    portalId: '21568098',
                                    formId: 'utm-attribution-form',
                                    target: '#hidden-form-container',
                                    onFormReady: function() {
                                        // Submit form immediately with UTM data
                                        const form = document.querySelector('#hidden-form-container form') as HTMLFormElement
                                        if (form) {
                                            // Add UTM parameters as hidden fields
                                            Object.entries(trackingParams).forEach(([key, value]) => {
                                                const input = document.createElement('input')
                                                input.type = 'hidden'
                                                input.name = key
                                                input.value = value || ''
                                                form.appendChild(input)
                                            })

                                            // Submit the form
                                            form.submit()
                                        }
                                    }
                                })
                            } catch (error) {
                                console.warn('Could not create UTM attribution form:', error)
                            }
                        }
                    }
                }
            }

            // Add event listener for HubSpot meeting events
            window.addEventListener('message', handleMeetingBooked)

            // Log tracking parameters for debugging (only in development)
            if (process.env.NODE_ENV === 'development') {
                const trackingParams = captureTrackingParams()
                console.log('🚀 BOOKING MODAL DEBUG SUMMARY:')
                console.log('📊 UTM Parameters:', formatTrackingParamsForLog(trackingParams))
                debugUTMCapture()
                console.log('🔗 Meeting URL with UTMs:', urlWithUtms)
                console.log('📅 Meeting iframe loading... Waiting for booking event')
            }

            // Cleanup function
            return () => {
                window.removeEventListener('message', handleMeetingBooked)
            }
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, t.booking.meetingUrl])

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
                onClick={onClose}
            />
            
            {/* Modal - Sin marco, solo el calendario */}
            <div className="relative overflow-hidden rounded-lg shadow-2xl" style={{ width: 'min(90vw, 1000px)', height: 'min(90vh, 750px)' }}>
                {/* Botón de cerrar flotante */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 z-20 p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all"
                    aria-label={locale === 'en' ? 'Close modal' : 'Cerrar modal'}>
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
                                {locale === 'en' ? 'Loading calendar...' : 'Cargando calendario...'}
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
                        key={`${locale}-${meetingUrl}`} // Forzar recreación del iframe cuando cambia el idioma o URL
                        src={meetingUrl || t.booking.meetingUrl}
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
                        title={locale === 'en' ? 'Schedule a meeting' : 'Agendar una reunión'}
                    />
                </div>

                {/* Hidden container for UTM attribution form */}
                <div id="hidden-form-container" style={{ display: 'none' }}></div>
            </div>
        </div>
    )
}