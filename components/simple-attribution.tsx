'use client'

import { useEffect } from 'react'
import { useAttribution } from '@/hooks/use-attribution'

export function SimpleAttribution() {
  const { utmParams, landingPage, referrer } = useAttribution()

  useEffect(() => {
    // Simple: Just send attribution data when page loads with UTMs
    if (Object.keys(utmParams).length > 0) {
      console.log('📊 UTMs detected, sending attribution immediately')

      // Create a placeholder contact immediately with UTMs
      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: `utm-tracking-${Date.now()}@placeholder.com`, // Placeholder
          firstname: 'UTM',
          lastname: 'Tracking',
          utmParams,
          landingPage,
          referrer,
          isFirstTouch: true
        })
      }).then(response => response.json())
        .then(result => {
          if (result.success) {
            console.log('✅ UTM attribution stored:', result.contactId)
            // Store the contact ID for later updates
            localStorage.setItem('utm_contact_id', result.contactId)
          }
        })
    }
  }, [utmParams, landingPage, referrer])

  return null // This component just handles attribution silently
}