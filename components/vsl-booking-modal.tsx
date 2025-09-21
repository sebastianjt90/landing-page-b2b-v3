'use client'

import { useEffect, useRef } from 'react'
import { useAttribution } from '@/hooks/use-attribution'
import { buildHubSpotMeetingUrl } from '@/lib/hubspot-meeting-url'

interface VSLBookingModalProps {
  isOpen: boolean
  onClose?: () => void
}

const VSL_MEETING_URL = 'https://meetings.hubspot.com/sebastian-jimenez-trujillo/vsl-demo?embed=true'

export function VSLBookingModal({ isOpen, onClose }: VSLBookingModalProps) {
  const { utmParams, landingPage, referrer } = useAttribution()
  const latestData = useRef({ utmParams, landingPage, referrer })

  useEffect(() => {
    latestData.current = { utmParams, landingPage, referrer }
  }, [utmParams, landingPage, referrer])

  useEffect(() => {
    if (!isOpen) return

    const { utmParams: currentUTM, landingPage: currentLanding, referrer: currentRef } = latestData.current

    const targetUrl = buildHubSpotMeetingUrl(VSL_MEETING_URL, {
      utmParams: currentUTM,
      landingPage: currentLanding,
      referrer: currentRef,
      includeContext: true,
      extraParams: {
        hsCtaTracking: 'vsl_redirect',
        hs_attribution_source: currentUTM.utm_source || 'vsl',
        booking_source: 'vsl_redirect'
      }
    })

    if (typeof window !== 'undefined') {
      onClose?.()
      window.location.href = targetUrl
    }
  }, [isOpen])

  return null
}
