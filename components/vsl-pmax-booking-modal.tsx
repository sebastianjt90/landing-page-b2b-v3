'use client'

import { useEffect, useRef } from 'react'
import { useAttribution } from '@/hooks/use-attribution'
import { buildHubSpotMeetingUrl } from '@/lib/hubspot-meeting-url'

interface VSLPmaxBookingModalProps {
  isOpen: boolean
  onClose?: () => void
}

const VSL_PMAX_MEETING_URL = 'https://meetings.hubspot.com/sebastian-jimenez-trujillo/vsl-pmax'

export function VSLPmaxBookingModal({ isOpen, onClose }: VSLPmaxBookingModalProps) {
  const { utmParams, landingPage, referrer } = useAttribution()
  const latestData = useRef({ utmParams, landingPage, referrer })

  useEffect(() => {
    latestData.current = { utmParams, landingPage, referrer }
  }, [utmParams, landingPage, referrer])

  useEffect(() => {
    if (!isOpen) return

    const { utmParams: currentUTM, landingPage: currentLanding, referrer: currentRef } = latestData.current

    const targetUrl = buildHubSpotMeetingUrl(VSL_PMAX_MEETING_URL, {
      utmParams: currentUTM,
      landingPage: currentLanding,
      referrer: currentRef,
      includeContext: true,
      extraParams: {
        hsCtaTracking: 'vsl_pmax_redirect',
        hs_attribution_source: currentUTM.utm_source || 'vsl-pmax',
        booking_source: 'vsl_pmax_redirect'
      }
    })

    if (typeof window !== 'undefined') {
      onClose?.()
      window.location.href = targetUrl
    }
  }, [isOpen])

  return null
}
