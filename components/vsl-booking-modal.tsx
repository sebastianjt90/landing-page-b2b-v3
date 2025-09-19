'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { buildMeetingUrlWithCurrentParams, captureTrackingParams, formatTrackingParamsForLog } from '@/lib/utm-utils'

interface VSLBookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VSLBookingModal({ isOpen, onClose }: VSLBookingModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [meetingUrl, setMeetingUrl] = useState<string>('')

  useEffect(() => {
    // Prevent scroll when modal is open and build meeting URL with UTMs
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsLoading(true)

      // Build meeting URL with current UTM parameters
      const baseUrl = 'https://meetings.hubspot.com/sebastian-jimenez-trujillo/vsl-demo?embed=true'
      const urlWithUtms = buildMeetingUrlWithCurrentParams(baseUrl)
      setMeetingUrl(urlWithUtms)

      // Log tracking parameters for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        const trackingParams = captureTrackingParams()
        console.log('📊 VSL Booking Modal - UTM Parameters:', formatTrackingParamsForLog(trackingParams))
        console.log('🔗 VSL Meeting URL with UTMs:', urlWithUtms)
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
        onClick={onClose}
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