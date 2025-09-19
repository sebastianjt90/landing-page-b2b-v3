/**
 * Utility functions for handling UTM parameters and tracking data
 * Captures UTM parameters from URL and formats them for HubSpot integration
 */

export interface TrackingParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  gclid?: string
  fbclid?: string
  msclkid?: string
  ttclid?: string
  li_fat_id?: string
  [key: string]: string | undefined
}

/**
 * Captures all tracking parameters from the current URL
 * Supports UTM parameters and click IDs from major ad platforms
 */
export function captureTrackingParams(): TrackingParams {
  if (typeof window === 'undefined') {
    return {}
  }

  const params = new URLSearchParams(window.location.search)
  const trackingParams: TrackingParams = {}

  // Standard UTM parameters (automatically mapped by HubSpot)
  const utmKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term'
  ]

  // Click IDs from major ad platforms (automatically mapped by HubSpot)
  const clickIdKeys = [
    'gclid',     // Google Click ID
    'fbclid',    // Facebook Click ID
    'msclkid',   // Microsoft Click ID
    'ttclid',    // TikTok Click ID
    'li_fat_id'  // LinkedIn Click ID
  ]

  // Capture UTM parameters
  utmKeys.forEach(key => {
    const value = params.get(key)
    if (value) {
      trackingParams[key] = value
    }
  })

  // Capture click IDs
  clickIdKeys.forEach(key => {
    const value = params.get(key)
    if (value) {
      trackingParams[key] = value
    }
  })

  return trackingParams
}

/**
 * Builds a HubSpot meeting URL with tracking parameters
 */
export function buildMeetingUrl(baseUrl: string, trackingParams?: TrackingParams): string {
  const url = new URL(baseUrl)

  // Add tracking parameters to the URL
  if (trackingParams) {
    Object.entries(trackingParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value)
      }
    })
  }

  return url.toString()
}

/**
 * Gets tracking parameters and builds HubSpot meeting URL
 */
export function buildMeetingUrlWithCurrentParams(baseUrl: string): string {
  const trackingParams = captureTrackingParams()
  return buildMeetingUrl(baseUrl, trackingParams)
}

/**
 * Formats tracking parameters for logging/debugging
 */
export function formatTrackingParamsForLog(params: TrackingParams): string {
  const entries = Object.entries(params).filter(([_, value]) => value)

  if (entries.length === 0) {
    return 'No tracking parameters found'
  }

  return entries
    .map(([key, value]) => `${key}=${value}`)
    .join(', ')
}

/**
 * Checks if the current page has any tracking parameters
 */
export function hasTrackingParams(): boolean {
  const params = captureTrackingParams()
  return Object.keys(params).length > 0
}