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
    const [isLoading, setIsLoading] = useState(true)
    const t = translations[locale as keyof typeof translations] || translations.es

    useEffect(() => {
        // Prevent scroll when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            setIsLoading(true)
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
                        key={locale} // Forzar recreación del iframe cuando cambia el idioma
                        src={t.booking.meetingUrl}
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
            </div>
        </div>
    )
}