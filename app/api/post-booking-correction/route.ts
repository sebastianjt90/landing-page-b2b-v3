/**
 * Post-Booking Attribution Correction API
 * Detects and corrects "Direct Traffic" attribution after meeting booking
 * This is Level 3 of our 4-tier attribution system
 */

import { NextRequest, NextResponse } from 'next/server'
import { processAttribution, UTMParams } from '@/lib/hubspot-attribution'

interface PostBookingCorrectionRequest {
  email: string
  meetingId?: string
  sessionData?: {
    utmParams: UTMParams
    landingPage: string
    referrer: string
    sessionId: string
    timestamp: string
  }
  forceCorrection?: boolean
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 POST-BOOKING CORRECTION: Starting attribution correction...')

    const body: PostBookingCorrectionRequest = await request.json()

    // Validate required data
    if (!body.email) {
      return NextResponse.json(
        { success: false, error: 'Email is required for correction' },
        { status: 400 }
      )
    }

    // Get HubSpot API key
    const apiKey = process.env.HUBSPOT_PRIVATE_ACCESS_TOKEN || process.env.HUBSPOT_API_KEY
    if (!apiKey) {
      console.error('❌ POST-BOOKING: HubSpot API key not configured')
      return NextResponse.json(
        { success: false, error: 'API configuration error' },
        { status: 500 }
      )
    }

    console.log('📧 POST-BOOKING: Processing correction for:', body.email)

    // Step 1: Get current contact data from HubSpot
    const currentContact = await getContactFromHubSpot(body.email, apiKey)
    if (!currentContact) {
      console.error('❌ POST-BOOKING: Contact not found in HubSpot')
      return NextResponse.json(
        { success: false, error: 'Contact not found in HubSpot' },
        { status: 404 }
      )
    }

    console.log('👤 POST-BOOKING: Current contact found:', currentContact.id)

    // Step 2: Check if correction is needed
    const needsCorrection = checkIfCorrectionNeeded(currentContact.properties, body.forceCorrection)

    if (!needsCorrection && !body.forceCorrection) {
      console.log('✅ POST-BOOKING: Contact already has proper attribution, no correction needed')
      return NextResponse.json({
        success: true,
        message: 'No correction needed - attribution already correct',
        contactId: currentContact.id,
        currentAttribution: currentContact.properties.hs_analytics_source
      })
    }

    // Step 3: Get UTM data for correction
    let utmData: UTMParams = {}
    let landingPage = ''
    let referrer = ''

    if (body.sessionData) {
      utmData = body.sessionData.utmParams
      landingPage = body.sessionData.landingPage
      referrer = body.sessionData.referrer
      console.log('📊 POST-BOOKING: Using provided session data for correction')
    } else {
      // Try to get UTM data from localStorage-like storage or pre-attribution data
      const preAttrData = await getStoredAttributionData(body.email)
      if (preAttrData) {
        utmData = preAttrData.utmParams
        landingPage = preAttrData.landingPage
        referrer = preAttrData.referrer
        console.log('📦 POST-BOOKING: Using stored attribution data for correction')
      }
    }

    if (!utmData || Object.keys(utmData).length === 0) {
      console.log('❌ POST-BOOKING: No UTM data available for correction')
      return NextResponse.json(
        { success: false, error: 'No UTM data available for correction' },
        { status: 400 }
      )
    }

    // Step 4: Process and apply attribution correction
    console.log('🔄 POST-BOOKING: Applying attribution correction with UTM data:', utmData)

    const attributionData = processAttribution(
      utmData,
      landingPage || request.url,
      referrer,
      false // This is a correction, not first touch
    )

    // Add correction metadata
    const enhancedAttributionData = {
      ...attributionData,
      attribution_correction_applied: 'true',
      attribution_correction_timestamp: new Date().toISOString(),
      attribution_correction_reason: 'post_booking_direct_traffic_fix',
      original_attribution: currentContact.properties.hs_analytics_source || 'direct'
    }

    // Step 5: Update contact in HubSpot
    const updateResult = await updateContactAttribution(
      currentContact.id,
      enhancedAttributionData,
      apiKey
    )

    if (updateResult.success) {
      console.log('✅ POST-BOOKING: Attribution correction applied successfully!')
      return NextResponse.json({
        success: true,
        message: 'Attribution correction applied successfully',
        contactId: currentContact.id,
        originalAttribution: currentContact.properties.hs_analytics_source || 'direct',
        newAttribution: utmData.utm_source,
        correctionTimestamp: enhancedAttributionData.attribution_correction_timestamp
      })
    } else {
      console.error('❌ POST-BOOKING: Failed to apply attribution correction:', updateResult.error)
      return NextResponse.json(
        { success: false, error: updateResult.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ POST-BOOKING: Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Get contact from HubSpot by email
 */
async function getContactFromHubSpot(email: string, apiKey: string) {
  try {
    const searchResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'EQ',
            value: email
          }]
        }],
        properties: [
          'email',
          'firstname',
          'lastname',
          'hs_analytics_source',
          'hs_analytics_source_data_1',
          'hs_analytics_source_data_2',
          'hs_latest_source',
          'utm_source_custom',
          'utm_medium_custom',
          'utm_campaign_custom',
          'createdate'
        ]
      })
    })

    if (searchResponse.ok) {
      const result = await searchResponse.json()
      return result.results.length > 0 ? result.results[0] : null
    }

    return null
  } catch (error) {
    console.error('❌ Error fetching contact from HubSpot:', error)
    return null
  }
}

/**
 * Check if attribution correction is needed
 */
function checkIfCorrectionNeeded(properties: ContactProperties, forceCorrection = false): boolean {
  if (forceCorrection) return true

  // Check for "direct traffic" indicators that need correction
  const directTrafficIndicators = [
    'direct',
    'direct_traffic',
    'DIRECT_TRAFFIC',
    '(direct)',
    null,
    undefined,
    ''
  ]

  const currentSource = properties.hs_analytics_source
  const hasCustomUTM = properties.utm_source_custom

  // Needs correction if:
  // 1. Current source is "direct" or similar
  // 2. AND we don't already have custom UTM data
  return directTrafficIndicators.includes(currentSource) && !hasCustomUTM
}

/**
 * Update contact attribution in HubSpot
 */
async function updateContactAttribution(contactId: string, attributionData: Record<string, string>, apiKey: string) {
  try {
    const updateResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: attributionData
      })
    })

    if (updateResponse.ok) {
      return { success: true }
    } else {
      const error = await updateResponse.json()
      return { success: false, error: error.message }
    }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Get stored attribution data (placeholder - would integrate with actual storage)
 */
async function getStoredAttributionData(email: string): Promise<{
  utmParams: UTMParams
  landingPage: string
  referrer: string
  sessionId: string
  timestamp: string
} | null> {
  // This would integrate with your session storage system
  // For now, return null as fallback
  console.log('📦 POST-BOOKING: Looking for stored attribution data for:', email)
  return null
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json(
      { success: false, error: 'Email parameter required for testing' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Post-booking correction API is working',
    testEmail: email,
    instructions: {
      usage: 'POST /api/post-booking-correction with contact data',
      example: {
        email: 'test@example.com',
        sessionData: {
          utmParams: {
            utm_source: 'facebook',
            utm_medium: 'cpc',
            utm_campaign: 'test_campaign'
          },
          landingPage: 'https://example.com/landing',
          referrer: 'https://facebook.com',
          sessionId: '123456',
          timestamp: new Date().toISOString()
        },
        forceCorrection: false
      }
    }
  })
}