/**
 * Hook for Pre-Attribution System
 * Captures and registers attribution BEFORE user opens booking modal
 * This ensures HubSpot has the correct attribution data regardless of iframe limitations
 */

'use client'

import { useCallback, useState } from 'react'
import { useAttribution } from './use-attribution'

export function usePreAttribution() {
  const [isPreRegistering, setIsPreRegistering] = useState(false)
  const { utmParams, landingPage, referrer, submitAttribution } = useAttribution()

  /**
   * Pre-registers a lead with attribution data before opening booking modal
   * This creates a "phantom" contact that gets updated when actual booking happens
   */
  const preRegisterLead = useCallback(async (): Promise<{
    success: boolean;
    preRegistrationId?: string;
    error?: string
  }> => {
    if (isPreRegistering) {
      console.log('⚠️ Pre-registration already in progress')
      return { success: false, error: 'Already in progress' }
    }

    // Only pre-register if we have UTM parameters
    if (!Object.keys(utmParams).some(key => utmParams[key as keyof typeof utmParams])) {
      console.log('📭 No UTMs to pre-register')
      return { success: false, error: 'No UTM parameters available' }
    }

    setIsPreRegistering(true)

    try {
      console.log('🎯 PRE-ATTRIBUTION: Starting lead pre-registration...')

      // Generate a unique session-based email for pre-attribution
      const sessionId = Date.now().toString()
      const preAttributionEmail = `pre-attribution-${sessionId}@lahaus-tracking.internal`

      console.log('📧 Pre-registering with session email:', preAttributionEmail)

      // Submit attribution with pre-registration flag
      const result = await submitAttribution({
        email: preAttributionEmail,
        firstname: 'Pre-Attribution',
        lastname: 'Lead'
      })

      if (result.success) {
        // Store pre-registration data for later use
        const preRegData = {
          sessionId,
          email: preAttributionEmail,
          utmParams,
          landingPage,
          referrer,
          timestamp: new Date().toISOString()
        }

        localStorage.setItem('lahaus_pre_attribution', JSON.stringify(preRegData))
        localStorage.setItem('lahaus_pre_attribution_timestamp', Date.now().toString())

        console.log('✅ PRE-ATTRIBUTION: Lead pre-registered successfully')
        console.log('📊 Stored pre-attribution data:', preRegData)

        return {
          success: true,
          preRegistrationId: sessionId
        }
      } else {
        console.error('❌ PRE-ATTRIBUTION: Failed to pre-register lead:', result.error)
        return {
          success: false,
          error: result.error
        }
      }

    } catch (error) {
      console.error('❌ PRE-ATTRIBUTION: Unexpected error:', error)
      return {
        success: false,
        error: 'Unexpected error during pre-registration'
      }
    } finally {
      setIsPreRegistering(false)
    }
  }, [isPreRegistering, utmParams, landingPage, referrer, submitAttribution])

  /**
   * Gets stored pre-attribution data for the current session
   */
  const getPreAttributionData = useCallback(() => {
    try {
      const stored = localStorage.getItem('lahaus_pre_attribution')
      if (stored) {
        const data = JSON.parse(stored)
        const timestamp = localStorage.getItem('lahaus_pre_attribution_timestamp')

        // Check if pre-attribution data is still fresh (valid for 30 minutes)
        if (timestamp && (Date.now() - parseInt(timestamp)) < 30 * 60 * 1000) {
          return data
        } else {
          // Clean up expired data
          localStorage.removeItem('lahaus_pre_attribution')
          localStorage.removeItem('lahaus_pre_attribution_timestamp')
          console.log('🧹 Cleaned up expired pre-attribution data')
        }
      }
    } catch (error) {
      console.warn('⚠️ Error reading pre-attribution data:', error)
    }
    return null
  }, [])

  /**
   * Clears pre-attribution data (call after successful real booking)
   */
  const clearPreAttributionData = useCallback(() => {
    localStorage.removeItem('lahaus_pre_attribution')
    localStorage.removeItem('lahaus_pre_attribution_timestamp')
    console.log('🧹 Pre-attribution data cleared')
  }, [])

  /**
   * Enhanced booking handler that includes pre-attribution
   */
  const handleBookingWithPreAttribution = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    console.log('🚀 ENHANCED BOOKING: Starting with pre-attribution...')

    // First, try to pre-register the lead
    const preRegResult = await preRegisterLead()

    if (!preRegResult.success) {
      console.warn('⚠️ Pre-registration failed, continuing with normal flow')
    }

    // Return success regardless of pre-registration result
    // The main booking flow will handle actual contact creation
    return { success: true }
  }, [preRegisterLead])

  return {
    preRegisterLead,
    getPreAttributionData,
    clearPreAttributionData,
    handleBookingWithPreAttribution,
    isPreRegistering,
    hasUTMsForPreAttribution: Object.keys(utmParams).some(key => utmParams[key as keyof typeof utmParams])
  }
}