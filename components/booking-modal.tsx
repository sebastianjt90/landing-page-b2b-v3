'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false)

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
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal - Más minimalista y maximizado */}
            <div className="relative w-full max-w-5xl h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden mx-4">
                {/* Header minimalista */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                        aria-label="Cerrar modal">
                        <X className="w-6 h-6" style={{ color: '#00251D' }} />
                    </button>
                </div>
                
                {/* Content - Sin padding excesivo */}
                <div className="h-full overflow-y-auto">
                    {/* HubSpot Meetings Widget Container - Ocupa todo el espacio */}
                    <div 
                        className="meetings-iframe-container h-full" 
                        data-src="https://meetings.hubspot.com/sebastian-jimenez-trujillo/lahausai-demo?embed=true"
                    />
                </div>
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