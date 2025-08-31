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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#F2F4F8' }}>
                    <h2 
                        className="text-xl font-semibold"
                        style={{ fontFamily: "'LaHaus Display', system-ui, sans-serif", color: '#00251D' }}>
                        Agenda tu demo personalizado
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                        aria-label="Cerrar modal">
                        <X className="w-5 h-5" style={{ color: '#00251D' }} />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                    <p 
                        className="mb-6 text-center"
                        style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif", color: '#00251D' }}>
                        Selecciona el día y hora que mejor te convenga. Recibirás una confirmación por correo.
                    </p>
                    
                    {/* HubSpot Meetings Widget Container */}
                    <div 
                        className="meetings-iframe-container" 
                        data-src="https://meetings.hubspot.com/sebastian-jimenez-trujillo/lahausai-demo?embed=true"
                        style={{ minHeight: '600px' }}
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