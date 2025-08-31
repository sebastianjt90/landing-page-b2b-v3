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
    const t = translations[locale as keyof typeof translations] || translations.es

    useEffect(() => {
        if (isOpen && !isScriptLoaded) {
            // Load HubSpot meetings embed script
            const script = document.createElement('script')
            script.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js'
            script.async = true
            script.onload = () => {
                setIsScriptLoaded(true)
                // Initialize HubSpot meetings widget after script loads
                if (window.HubSpotMeetings) {
                    window.HubSpotMeetings.init()
                }
            }
            document.body.appendChild(script)

            return () => {
                // Cleanup if needed
                if (document.body.contains(script)) {
                    document.body.removeChild(script)
                }
            }
        }
    }, [isOpen, isScriptLoaded])

    useEffect(() => {
        // Prevent scroll when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
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