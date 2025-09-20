'use client'

import { useAttribution } from '@/hooks/use-attribution'

export function SimpleAttribution() {
  const { utmParams, landingPage, referrer } = useAttribution()

  // Only capture and store UTM data in localStorage for later use
  // Do NOT create fake contacts - attribution will be added when real users interact
  if (typeof window !== 'undefined' && Object.keys(utmParams).length > 0) {
    console.log('📊 UTMs detected and stored for later attribution:', utmParams)
  }

  return null // This component just handles attribution silently
}