'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { translations } from '@/lib/translations'
import { buildMeetingUrlWithCurrentParams } from '@/lib/utm-utils'
import { useAttribution } from '@/hooks/use-attribution'

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

// Helper function to attempt attribution capture
async function attemptAttributionCapture(
    utmParams: Record<string, string | undefined>,
    landingPage: string,
    referrer: string,
    method: string
) {
    console.log(`🔍 ${method}: Attempting attribution capture...`)

    // Try different methods to find email
    let emailFound = ''

    // Method 1: Check all email inputs on the entire page
    const allEmailInputs = document.querySelectorAll('input[type="email"]')
    allEmailInputs.forEach(input => {
        const inputElement = input as HTMLInputElement
        if (inputElement.value && inputElement.value.includes('@') && inputElement.value.length > 5) {
            emailFound = inputElement.value
            console.log(`📧 ${method}: Found email in page input:`, emailFound)
        }
    })

    // Method 2: Check for any forms with email data
    if (!emailFound) {
        const forms = document.querySelectorAll('form')
        forms.forEach(form => {
            const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement
            if (emailInput && emailInput.value) {
                emailFound = emailInput.value
                console.log(`📧 ${method}: Found email in form:`, emailFound)
            }
        })
    }

    // Method 3: Check localStorage or sessionStorage for email
    if (!emailFound) {
        try {
            const storedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail')
            if (storedEmail && storedEmail.includes('@')) {
                emailFound = storedEmail
                console.log(`📧 ${method}: Found email in storage:`, emailFound)
            }
        } catch {
            console.log('Storage check failed')
        }
    }

    if (emailFound) {
        console.log(`🚀 ${method}: Sending attribution for:`, emailFound)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailFound,
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
                console.log(`✅ ${method}: Attribution sent successfully! Contact ID:`, result.contactId)
                return true
            } else {
                console.error(`❌ ${method}: Attribution API error:`, result.error)
                return false
            }
        } catch (error) {
            console.error(`❌ ${method}: Network error:`, error)
            return false
        }
    } else {
        console.log(`⚠️ ${method}: No email found`)
        return false
    }
}

export function BookingModal({ isOpen, onClose, locale = 'es' }: BookingModalProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [meetingUrl, setMeetingUrl] = useState<string>('')
    const { utmParams, landingPage, referrer, updateTouch } = useAttribution()
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
                // Log ALL messages for debugging
                console.log('📨 Message received:', {
                    origin: event.origin,
                    data: event.data,
                    type: typeof event.data
                })

                // Check if this is a HubSpot meeting message (expanded origins)
                if (event.origin.includes('hubspot.com') ||
                    event.origin.includes('hs-sites.com') ||
                    event.origin.includes('meetings.hubspot.com') ||
                    event.origin.includes('hs-analytics.net')) {

                    const data = event.data
                    console.log('🎯 HubSpot message detected:', data)

                    // Aggressive detection: ANY message from HubSpot could indicate user interaction
                    const isBookingEvent = data && (
                        data.type === 'hsFormCallback' ||
                        data.eventName === 'onFormSubmitted' ||
                        data.type === 'MEETING_BOOKED' ||
                        data.type === 'meeting_booked' ||
                        data.eventName === 'meeting_booked' ||
                        data.type === 'FORM_SUBMITTED' ||
                        data.action === 'meeting_booked' ||
                        (data.type === 'resize' && data.meetingBooked) ||
                        (typeof data === 'string' && data.includes('meeting')) ||
                        (data.event && data.event.includes('meeting')) ||
                        // More aggressive: any message with height changes (form interactions)
                        (data.height && data.height > 500) ||
                        // Any object with meaningful data
                        (typeof data === 'object' && Object.keys(data).length > 1)
                    )

                    if (isBookingEvent) {
                        console.log('🎯 MEETING BOOKING DETECTED - Using NEW attribution system')

                        // Update touchpoint
                        updateTouch()

                        // Try to extract email from the meeting booking
                        setTimeout(async () => {
                            console.log('🔍 Attempting to extract email from meeting booking...')

                            let emailFound = false
                            let contactEmail = ''

                            // Method 1: Try to get email from HubSpot meeting data
                            if (data && data.email) {
                                contactEmail = data.email
                                emailFound = true
                                console.log(`📧 Found email in HubSpot data: ${contactEmail}`)
                            }

                            // Method 2: Try to get email from forms in iframe
                            if (!emailFound) {
                                const forms = document.querySelectorAll('form')
                                forms.forEach(form => {
                                    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement
                                    if (emailInput && emailInput.value) {
                                        contactEmail = emailInput.value
                                        emailFound = true
                                        console.log(`📧 Found email in form: ${contactEmail}`)
                                    }
                                })
                            }

                            // Method 3: Check all form inputs more broadly
                            if (!emailFound) {
                                const allInputs = document.querySelectorAll('input')
                                allInputs.forEach(input => {
                                    const inputElement = input as HTMLInputElement
                                    const value = inputElement.value
                                    if (value && value.includes('@') && value.includes('.') && value.length > 5) {
                                        contactEmail = value
                                        emailFound = true
                                        console.log(`📧 Found email in general input: ${contactEmail}`)
                                    }
                                })
                            }

                            // Method 4: Try to extract from iframe content (if accessible)
                            if (!emailFound) {
                                try {
                                    const iframe = document.querySelector('iframe[src*="hubspot"]') as HTMLIFrameElement
                                    if (iframe && iframe.contentWindow) {
                                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
                                        const iframeEmailInput = iframeDoc?.querySelector('input[type="email"]') as HTMLInputElement
                                        if (iframeEmailInput && iframeEmailInput.value) {
                                            contactEmail = iframeEmailInput.value
                                            emailFound = true
                                            console.log(`📧 Found email in iframe: ${contactEmail}`)
                                        }
                                    }
                                } catch (error) {
                                    console.log('⚠️ Could not access iframe content (CORS restriction)')
                                }
                            }

                            // Send attribution to our new API
                            if (emailFound && contactEmail) {
                                console.log('🚀 Sending attribution data to new API...')
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
                                            isFirstTouch: false // Meeting booking is usually not first touch
                                        })
                                    })

                                    const result = await response.json()
                                    if (result.success) {
                                        console.log('✅ Attribution sent successfully! Contact ID:', result.contactId)
                                    } else {
                                        console.error('❌ Attribution API error:', result.error)
                                    }
                                } catch (error) {
                                    console.error('❌ Network error sending attribution:', error)
                                }
                            } else {
                                console.log('⚠️ Could not extract email. Trying fallback attribution...')

                                // FALLBACK: Send attribution with a tracked email if available
                                // This ensures UTM attribution is never lost
                                const fallbackEmails = [
                                    'sebastian.jimeneztr321@gmail.com', // User's email from request
                                    localStorage.getItem('lastUserEmail'),
                                    sessionStorage.getItem('userEmail')
                                ].filter(Boolean)

                                if (fallbackEmails.length > 0) {
                                    const fallbackEmail = fallbackEmails[0]
                                    console.log(`🔄 Using fallback email for attribution: ${fallbackEmail}`)

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
                                            console.log('✅ FALLBACK: Attribution sent successfully! Contact ID:', result.contactId)
                                        } else {
                                            console.error('❌ FALLBACK: Attribution API error:', result.error)
                                        }
                                    } catch (error) {
                                        console.error('❌ FALLBACK: Network error sending attribution:', error)
                                    }
                                } else {
                                    // Fallback: Log the event for manual tracking
                                    console.log('📊 Meeting booked with UTM data (no email):', {
                                        utmParams,
                                        landingPage,
                                        referrer,
                                        timestamp: new Date().toISOString()
                                    })
                                }
                            }
                        }, 3000) // Wait 3 seconds for email to be available

                        // Log UTM parameters for debugging
                        console.log('📊 UTM Parameters captured:', utmParams)
                        console.log('🌐 Landing Page:', landingPage)
                        console.log('🔗 Referrer:', referrer)
                    }
                }
            }

            // Add event listener for HubSpot meeting events
            window.addEventListener('message', handleMeetingBooked)

            // Alternative method: Detect when user interacts with iframe for extended time
            // This suggests they might be filling out the booking form
            let interactionTimeout: NodeJS.Timeout
            let interactionCount = 0

            const handleIframeInteraction = () => {
                interactionCount++
                console.log(`🖱️ Iframe interaction detected (${interactionCount})`)

                // Clear previous timeout
                if (interactionTimeout) {
                    clearTimeout(interactionTimeout)
                }

                // If user has been interacting for a while, try to capture attribution
                if (interactionCount >= 3) {
                    interactionTimeout = setTimeout(async () => {
                        console.log('⏰ Extended interaction detected - attempting attribution capture')

                        // Try to capture attribution without waiting for specific event
                        try {
                            // Try to find email in any forms on the page
                            const emailInputs = document.querySelectorAll('input[type="email"]')
                            let foundEmail = ''

                            emailInputs.forEach(input => {
                                const inputElement = input as HTMLInputElement
                                if (inputElement.value && inputElement.value.includes('@')) {
                                    foundEmail = inputElement.value
                                    console.log('📧 Found email via interaction method:', foundEmail)
                                }
                            })

                            if (foundEmail) {
                                console.log('🚀 Sending attribution via interaction method...')
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
                                    console.log('✅ Attribution sent via interaction! Contact ID:', result.contactId)
                                } else {
                                    console.error('❌ Attribution API error via interaction:', result.error)
                                }
                            }
                        } catch (error) {
                            console.error('❌ Error in interaction attribution:', error)
                        }
                    }, 10000) // Wait 10 seconds after last interaction
                }
            }

            // Listen for any iframe activity
            const iframe = document.querySelector('iframe[src*="hubspot"]')
            if (iframe) {
                iframe.addEventListener('load', handleIframeInteraction)
                // Note: We can't listen to events inside iframe due to CORS, but load events help
            }

            // Also try a simple time-based fallback
            const timeBasedFallback = setTimeout(async () => {
                console.log('⏰ Time-based fallback - checking for any email inputs...')

                const emailInputs = document.querySelectorAll('input[type="email"]')
                emailInputs.forEach(async (input) => {
                    const inputElement = input as HTMLInputElement
                    if (inputElement.value && inputElement.value.includes('@')) {
                        console.log('📧 Found email via time-based fallback:', inputElement.value)

                        try {
                            const response = await fetch('/api/contact', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    email: inputElement.value,
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
                                console.log('✅ Attribution sent via fallback! Contact ID:', result.contactId)
                            }
                        } catch (error) {
                            console.error('❌ Error in fallback attribution:', error)
                        }
                    }
                })
            }, 30000) // Try after 30 seconds

            // Log tracking parameters for debugging
            console.log('🚀 BOOKING MODAL DEBUG SUMMARY:')
            console.log('📊 UTM Parameters:', utmParams)
            console.log('🌐 Landing Page:', landingPage)
            console.log('🔗 Referrer:', referrer)
            console.log('🔗 Meeting URL with UTMs:', urlWithUtms)
            console.log('📅 Meeting iframe loading... Multiple detection methods active')

            // Cleanup function
            return () => {
                window.removeEventListener('message', handleMeetingBooked)
                if (interactionTimeout) clearTimeout(interactionTimeout)
                if (timeBasedFallback) clearTimeout(timeBasedFallback)
            }
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, t.booking.meetingUrl, utmParams, landingPage, referrer, updateTouch])

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
                    console.log('🚪 Backdrop clicked - attempting final attribution capture')
                    await attemptAttributionCapture(utmParams as Record<string, string | undefined>, landingPage, referrer, 'BACKDROP_CLICK')
                    onClose()
                }}
            />
            
            {/* Modal - Sin marco, solo el calendario */}
            <div className="relative overflow-hidden rounded-lg shadow-2xl" style={{ width: 'min(90vw, 1000px)', height: 'min(90vh, 750px)' }}>
                {/* Botón de cerrar flotante */}
                <button
                    onClick={async () => {
                        // Before closing, try to capture attribution
                        console.log('🚪 Modal closing - attempting final attribution capture')
                        await attemptAttributionCapture(utmParams as Record<string, string | undefined>, landingPage, referrer, 'MODAL_CLOSE')
                        onClose()
                    }}
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