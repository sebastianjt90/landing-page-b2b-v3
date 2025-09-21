'use client'

import { useEffect, useRef } from 'react'
import { useAttribution } from '@/hooks/use-attribution'
import { translations } from '@/lib/translations'
import { buildHubSpotMeetingUrl } from '@/lib/hubspot-meeting-url'

interface BookingModalProps {
  isOpen: boolean
  onClose?: () => void
  locale?: string
}

export function BookingModal({ isOpen, onClose, locale = 'es' }: BookingModalProps) {
  const { utmParams, landingPage, referrer } = useAttribution()
  const latestData = useRef({ utmParams, landingPage, referrer })

  useEffect(() => {
    latestData.current = { utmParams, landingPage, referrer }
  }, [utmParams, landingPage, referrer])

  useEffect(() => {
    if (!isOpen) return

    const validLocale = locale === 'en' ? 'en' : 'es'
    const meetingBaseUrl = translations[validLocale]?.booking?.meetingUrl

    if (!meetingBaseUrl) {
      console.warn('No HubSpot meeting URL configured for locale', validLocale)
      return
    }

    const { utmParams: currentUTM, landingPage: currentLanding, referrer: currentRef } = latestData.current

    const targetUrl = buildHubSpotMeetingUrl(meetingBaseUrl, {
      utmParams: currentUTM,
      landingPage: currentLanding,
      referrer: currentRef,
      includeContext: true,
      extraParams: {
        hsCtaTracking: 'redirect',
        hs_attribution_source: currentUTM.utm_source || 'website'
      }
    })

    if (typeof window !== 'undefined') {
      onClose?.()
      window.location.href = targetUrl
    }
  }, [isOpen, locale, onClose])

  return null
}
