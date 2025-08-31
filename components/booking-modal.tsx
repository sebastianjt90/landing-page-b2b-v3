'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { translations } from '@/lib/translations'

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
    locale?: string
}

export function BookingModal({ isOpen, onClose, locale = 'es' }: BookingModalProps) {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false)
    const [currentLocale, setCurrentLocale] = useState(locale)
    const t = translations[locale as keyof typeof translations] || translations.es

    // Reset and reload when locale changes
    useEffect(() => {
        if (locale !== currentLocale) {
            setCurrentLocale(locale)
            setIsScriptLoaded(false)
            // Remove existing iframe containers to force reload
            const containers = document.querySelectorAll('.meetings-iframe-container iframe')
            containers.forEach(container => container.remove())
        }
    }, [locale, currentLocale])

    useEffect(() => {
        if (isOpen && !isScriptLoaded) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                // Load HubSpot meetings embed script
                const existingScript = document.querySelector('script[src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"]')
                
                if (existingScript) {
                    // Script already loaded, just reinitialize
                    if (window.HubSpotMeetings) {
                        window.HubSpotMeetings.init()
                    }
                    setIsScriptLoaded(true)
                } else {
                    // Load script for the first time
                    const script = document.createElement('script')
                    script.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js'
                    script.async = true
                    script.onload = () => {
                        setIsScriptLoaded(true)
                        if (window.HubSpotMeetings) {
                            window.HubSpotMeetings.init()
                        }
                    }
                    document.body.appendChild(script)
                }
            }, 100)

            return () => clearTimeout(timer)
        }
    }, [isOpen, isScriptLoaded, locale])

    useEffect(() => {
        // Prevent scroll when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
            // Clean up iframe when modal closes
            const containers = document.querySelectorAll('.meetings-iframe-container iframe')
            containers.forEach(container => container.remove())
            setIsScriptLoaded(false)
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal - Sin marco, solo el calendario */}
            <div className="relative" style={{ width: 'min(90vw, 1000px)', height: 'min(90vh, 750px)' }}>
                {/* Botón de cerrar flotante */}
                <button
                    onClick={onClose}
                    className="absolute -top-14 right-0 z-10 p-3 bg-white hover:bg-gray-100 rounded-full shadow-xl transition-all"
                    aria-label="Cerrar modal">
                    <X className="w-6 h-6" style={{ color: '#00251D' }} />
                </button>
                
                {/* HubSpot Meetings Widget Container - Sin contenedor adicional */}
                <div 
                    key={`hubspot-meeting-${locale}`}
                    className="meetings-iframe-container" 
                    data-src={t.booking.meetingUrl}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        </div>
    )
}

// Type declaration for HubSpot
declare global {
    interface Window {
        HubSpotMeetings: {
            init: () => void
        }
    }
}