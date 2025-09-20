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
  const entries = Object.entries(params).filter(([, value]) => value)

  if (entries.length === 0) {
    return 'No tracking parameters found'
  }

  return entries
    .map(([key, value]) => `${key}=${value}`)
    .join(', ')
}

/**
 * Logs comprehensive debugging information about UTM capture AND HubSpot availability
 */
export function debugUTMCapture(): void {
  if (typeof window === 'undefined') {
    console.log('🚫 UTM Debug: Running on server side')
    return
  }

  console.group('🔍 UTM Capture Debug Information')

  // Current URL
  console.log('📍 Current URL:', window.location.href)
  console.log('📍 Search Params:', window.location.search)

  // URL Parameters
  const params = new URLSearchParams(window.location.search)
  console.log('📋 All URL Parameters:', Object.fromEntries(params.entries()))

  // Captured tracking parameters
  const trackingParams = captureTrackingParams()
  console.log('🎯 Captured Tracking Parameters:', trackingParams)
  console.log('📊 Formatted for Log:', formatTrackingParamsForLog(trackingParams))

  // Build example meeting URL
  const exampleBaseUrl = 'https://meetings.hubspot.com/sebastian-jimenez-trujillo/lahausai-demo?embed=true&lang=es'
  const finalUrl = buildMeetingUrl(exampleBaseUrl, trackingParams)
  console.log('🔗 Example Meeting URL with UTMs:', finalUrl)

  // NEW: HubSpot Availability Check
  console.group('🔧 HubSpot Tracking Availability')
  console.log('window.hbspt exists:', typeof window.hbspt !== 'undefined')
  console.log('window.hbspt.identify exists:', window.hbspt?.identify ? 'YES' : 'NO')
  console.log('window._hsq exists:', typeof window._hsq !== 'undefined')
  console.log('window._hsq length:', window._hsq?.length || 'N/A')

  // Check for HubSpot portal ID in scripts
  const scripts = Array.from(document.getElementsByTagName('script'))
  const hubspotScripts = scripts.filter(script => script.src.includes('hubspot') || script.src.includes('hs-scripts'))
  console.log('HubSpot scripts found:', hubspotScripts.length)
  hubspotScripts.forEach((script, index) => {
    console.log(`  Script ${index + 1}:`, script.src)
  })

  // Check for HubSpot portal ID in the page
  const portalMatch = document.documentElement.innerHTML.match(/portalId['"]\s*:\s*['"]*(\d+)/i)
  console.log('HubSpot Portal ID found:', portalMatch ? portalMatch[1] : 'Not found')

  console.groupEnd()
  console.groupEnd()
}

/**
 * Checks if the current page has any tracking parameters
 */
export function hasTrackingParams(): boolean {
  const params = captureTrackingParams()
  return Object.keys(params).length > 0
}

/**
 * Waits for HubSpot tracking API to be available
 */
export function waitForHubSpotAPI(maxAttempts: number = 20, delay: number = 500): Promise<boolean> {
  return new Promise((resolve) => {
    let attempts = 0

    const checkHubSpot = () => {
      attempts++

      // Check if HubSpot API is available
      if (window.hbspt && window.hbspt.identify) {
        console.log(`✅ HubSpot API available after ${attempts} attempts`)
        resolve(true)
        return
      }

      // Check if we've exceeded max attempts
      if (attempts >= maxAttempts) {
        console.warn(`⚠️ HubSpot API not available after ${maxAttempts} attempts`)
        resolve(false)
        return
      }

      // Try again after delay
      setTimeout(checkHubSpot, delay)
    }

    checkHubSpot()
  })
}

/**
 * Sends UTM tracking parameters directly to HubSpot tracking
 * Uses multiple methods to ensure the best chance of successful attribution
 */
export function sendUTMsToHubSpot(params: TrackingParams): boolean {
  if (typeof window === 'undefined') {
    console.log('🚫 HubSpot Tracking: Running on server side')
    return false
  }

  // Check if we have parameters to send
  const hasParams = Object.keys(params).length > 0
  if (!hasParams) {
    console.log('📭 HubSpot Tracking: No UTM parameters to send')
    return false
  }

  let trackingSent = false

  try {
    // Method 1: Use HubSpot tracking API (hbspt.identify)
    if (window.hbspt && window.hbspt.identify) {
      console.log('📡 Sending UTMs to HubSpot via hbspt.identify:', params)
      window.hbspt.identify(params)
      trackingSent = true
    }
    // Method 2: Use HubSpot queue (_hsq) as fallback
    else if (window._hsq) {
      console.log('📡 Sending UTMs to HubSpot via _hsq queue:', params)
      window._hsq.push(['identify', params])
      trackingSent = true
    }

    // Method 3: Try to update the hubspotutk cookie directly with attribution data
    if (window.hbspt && window.hbspt.cta) {
      try {
        // Set analytics properties that HubSpot can pick up
        window.hbspt.cta.load(21568098, 'utm-tracking', params)
        console.log('📡 Sent UTMs via HubSpot CTA tracking')
        trackingSent = true
      } catch (error) {
        console.log('CTA tracking not available:', error)
      }
    }

    // Method 4: Use HubSpot Analytics API if available
    if ((window as any).hsq) {
      try {
        (window as any).hsq.push(['setAttributionParams', params])
        console.log('📡 Sent UTMs via HubSpot Analytics API')
        trackingSent = true
      } catch (error) {
        console.log('Analytics API not available:', error)
      }
    }

    // Method 5: Store in sessionStorage for forms to pick up later
    try {
      sessionStorage.setItem('hubspot_utm_params', JSON.stringify(params))
      console.log('💾 Stored UTMs in sessionStorage for form pickup')
      trackingSent = true
    } catch (error) {
      console.log('SessionStorage not available:', error)
    }

    if (!trackingSent) {
      console.warn('⚠️ HubSpot tracking not available. Ensure HubSpot script is loaded.')
      console.log('Available objects:', {
        hbspt: typeof window.hbspt,
        _hsq: typeof window._hsq,
        hbspt_identify: window.hbspt?.identify ? 'available' : 'not available',
        hbspt_cta: window.hbspt?.cta ? 'available' : 'not available',
        hsq: typeof window.hsq
      })
    } else {
      console.log('✅ UTM tracking sent to HubSpot successfully')
    }

    return trackingSent

  } catch (error) {
    console.error('❌ Error sending UTMs to HubSpot:', error)
    return false
  }
}

/**
 * Sends UTM tracking parameters to HubSpot with retry mechanism
 * Waits for HubSpot API to be available before sending
 */
export async function sendUTMsToHubSpotWithRetry(params: TrackingParams): Promise<boolean> {
  if (typeof window === 'undefined') {
    console.log('🚫 HubSpot Tracking: Running on server side')
    return false
  }

  // Check if we have parameters to send
  const hasParams = Object.keys(params).length > 0
  if (!hasParams) {
    console.log('📭 HubSpot Tracking: No UTM parameters to send')
    return false
  }

  console.log('🔄 Waiting for HubSpot API to be available...')
  const hubspotAvailable = await waitForHubSpotAPI()

  if (!hubspotAvailable) {
    console.warn('⚠️ HubSpot API not available, trying fallback methods')
    return sendUTMsToHubSpot(params)
  }

  return sendUTMsToHubSpot(params)
}

/**
 * Captures current UTMs and sends them to HubSpot tracking
 * Combines capture + send in one convenient function
 */
export function captureAndSendUTMsToHubSpot(): boolean {
  const trackingParams = captureTrackingParams()

  if (process.env.NODE_ENV === 'development') {
    console.group('🎯 Capture & Send UTMs to HubSpot')
    console.log('📊 Captured Parameters:', trackingParams)
    console.log('📊 Formatted:', formatTrackingParamsForLog(trackingParams))
  }

  const success = sendUTMsToHubSpot(trackingParams)

  if (process.env.NODE_ENV === 'development') {
    console.log(`${success ? '✅' : '❌'} HubSpot tracking ${success ? 'successful' : 'failed'}`)
    console.groupEnd()
  }

  return success
}

/**
 * Captures current UTMs and sends them to HubSpot tracking with retry mechanism
 * Async version that waits for HubSpot API to be available
 */
export async function captureAndSendUTMsToHubSpotAsync(): Promise<boolean> {
  const trackingParams = captureTrackingParams()

  if (process.env.NODE_ENV === 'development') {
    console.group('🎯 Capture & Send UTMs to HubSpot (Async with Retry)')
    console.log('📊 Captured Parameters:', trackingParams)
    console.log('📊 Formatted:', formatTrackingParamsForLog(trackingParams))
  }

  const success = await sendUTMsToHubSpotWithRetry(trackingParams)

  if (process.env.NODE_ENV === 'development') {
    console.log(`${success ? '✅' : '❌'} HubSpot tracking ${success ? 'successful' : 'failed'}`)
    console.groupEnd()
  }

  return success
}