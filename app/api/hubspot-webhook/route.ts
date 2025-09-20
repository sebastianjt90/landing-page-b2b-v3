/**
 * HubSpot Webhook Handler - Level 4 Attribution System
 * Handles server-side attribution sync when HubSpot sends webhook notifications
 * This ensures no attribution is ever lost, even when client-side tracking fails
 */

import { NextRequest, NextResponse } from 'next/server'
import { UTMParams } from '@/lib/hubspot-attribution'

// HubSpot Webhook Event Types we care about
interface HubSpotWebhookEvent {
  eventId: number
  subscriptionId: number
  portalId: number
  appId: number
  eventName: string
  subscriptionType: string
  objectId: number
  propertyName?: string
  propertyValue?: string
  changeSource: string
  eventTime: number
  attemptNumber?: number
}

interface HubSpotWebhookPayload {
  events: HubSpotWebhookEvent[]
}

// Contact properties we need for attribution correction
interface ContactProperties {
  email?: string
  firstname?: string
  lastname?: string
  hs_analytics_source?: string
  hs_analytics_source_data_1?: string
  hs_analytics_source_data_2?: string
  hs_latest_source?: string
  utm_source_custom?: string
  utm_medium_custom?: string
  utm_campaign_custom?: string
  createdate?: string
  lastmodifieddate?: string
  hs_lifecyclestage_lead_date?: string
  [key: string]: string | undefined
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 LEVEL 4 WEBHOOK: HubSpot webhook received...')

    const body: HubSpotWebhookPayload = await request.json()
    console.log('📋 Webhook payload:', JSON.stringify(body, null, 2))

    // Get HubSpot API key
    const apiKey = process.env.HUBSPOT_PRIVATE_ACCESS_TOKEN || process.env.HUBSPOT_API_KEY
    if (!apiKey) {
      console.error('❌ WEBHOOK: HubSpot API key not configured')
      return NextResponse.json(
        { success: false, error: 'API configuration error' },
        { status: 500 }
      )
    }

    const processedEvents = []

    for (const event of body.events) {
      console.log('🔍 Processing webhook event:', {
        eventName: event.eventName,
        subscriptionType: event.subscriptionType,
        objectId: event.objectId,
        propertyName: event.propertyName,
        propertyValue: event.propertyValue,
        changeSource: event.changeSource
      })

      // We're interested in contact creation and meeting bookings
      const isRelevantEvent =
        event.subscriptionType === 'contact.creation' ||
        event.subscriptionType === 'contact.propertyChange' ||
        event.subscriptionType === 'meeting.creation' ||
        (event.propertyName && ['hs_analytics_source', 'hs_latest_source', 'lifecyclestage'].includes(event.propertyName))

      if (isRelevantEvent) {
        console.log('✅ WEBHOOK: Relevant event detected for attribution processing')

        // Get the contact data from HubSpot
        const contactData = await getContactFromHubSpot(event.objectId.toString(), apiKey)

        if (contactData && contactData.properties.email) {
          console.log('👤 WEBHOOK: Contact found:', {
            id: contactData.id,
            email: contactData.properties.email,
            source: contactData.properties.hs_analytics_source,
            customUTM: contactData.properties.utm_source_custom
          })

          // Check if this contact needs attribution correction
          const needsCorrection = await checkWebhookAttributionCorrection(contactData.properties)

          if (needsCorrection) {
            console.log('🔧 WEBHOOK: Attribution correction needed for contact:', contactData.properties.email)

            // Try to get stored attribution data or use pre-attribution data
            const attributionData = await getStoredAttributionForContact(contactData.properties.email)

            if (attributionData) {
              console.log('📊 WEBHOOK: Found attribution data for correction:', attributionData)

              // Apply attribution correction via our post-booking API
              const correctionResult = await applyWebhookAttributionCorrection(
                contactData.properties.email,
                attributionData,
                contactData.id
              )

              if (correctionResult.success) {
                console.log('✅ WEBHOOK: Attribution correction applied successfully!')
                processedEvents.push({
                  contactId: contactData.id,
                  email: contactData.properties.email,
                  correctionApplied: true,
                  originalSource: contactData.properties.hs_analytics_source,
                  correctedSource: attributionData.utmParams.utm_source
                })
              } else {
                console.log('⚠️ WEBHOOK: Attribution correction failed:', correctionResult.error)
                processedEvents.push({
                  contactId: contactData.id,
                  email: contactData.properties.email,
                  correctionApplied: false,
                  error: correctionResult.error
                })
              }
            } else {
              console.log('📭 WEBHOOK: No attribution data found for contact')
              processedEvents.push({
                contactId: contactData.id,
                email: contactData.properties.email,
                correctionApplied: false,
                reason: 'no_attribution_data'
              })
            }
          } else {
            console.log('✅ WEBHOOK: Contact already has proper attribution')
            processedEvents.push({
              contactId: contactData.id,
              email: contactData.properties.email,
              correctionApplied: false,
              reason: 'attribution_already_correct'
            })
          }
        } else {
          console.log('⚠️ WEBHOOK: Could not retrieve contact data for ID:', event.objectId)
          processedEvents.push({
            contactId: event.objectId,
            correctionApplied: false,
            reason: 'contact_not_found'
          })
        }
      } else {
        console.log('🔇 WEBHOOK: Event not relevant for attribution processing')
        processedEvents.push({
          eventId: event.eventId,
          correctionApplied: false,
          reason: 'not_relevant_event'
        })
      }
    }

    console.log('🎯 WEBHOOK: Processing complete. Results:', processedEvents)

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      eventsProcessed: body.events.length,
      attributionCorrections: processedEvents.filter(e => e.correctionApplied).length,
      results: processedEvents
    })

  } catch (error) {
    console.error('❌ WEBHOOK: Unexpected error processing webhook:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Get contact from HubSpot by contact ID
 */
async function getContactFromHubSpot(contactId: string, apiKey: string) {
  try {
    const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      return await response.json()
    } else {
      console.error('❌ WEBHOOK: Failed to fetch contact from HubSpot:', response.status)
      return null
    }
  } catch (error) {
    console.error('❌ WEBHOOK: Error fetching contact:', error)
    return null
  }
}

/**
 * Check if webhook-triggered attribution correction is needed
 */
async function checkWebhookAttributionCorrection(properties: ContactProperties): Promise<boolean> {
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
  // 3. OR if the contact was just created (recent createdate)

  const needsSourceCorrection = directTrafficIndicators.includes(currentSource) && !hasCustomUTM

  // Also check if this is a very recent contact (created in last 10 minutes)
  // This catches contacts that might benefit from immediate attribution correction
  const isRecentContact = properties.createdate ?
    (Date.now() - new Date(properties.createdate).getTime()) < 10 * 60 * 1000 : false

  console.log('🔍 WEBHOOK: Attribution check:', {
    currentSource,
    hasCustomUTM: !!hasCustomUTM,
    needsSourceCorrection,
    isRecentContact,
    createDate: properties.createdate
  })

  return needsSourceCorrection || (isRecentContact && !hasCustomUTM)
}

/**
 * Get stored attribution data for a contact
 * This would integrate with your session storage system
 */
async function getStoredAttributionForContact(email: string): Promise<{
  utmParams: UTMParams
  landingPage: string
  referrer: string
  sessionId: string
  timestamp: string
} | null> {
  try {
    console.log('🔍 WEBHOOK: Looking for stored attribution data for:', email)

    // In a real implementation, this would:
    // 1. Check Redis/database for recent UTM data associated with this email
    // 2. Check pre-attribution storage
    // 3. Look up session-based attribution data

    // For now, we'll implement a basic fallback mechanism
    // You would replace this with your actual storage lookup

    // Try to get the most recent attribution data from our logs or cache
    // This is a placeholder - implement your actual storage mechanism here

    return null // Will be implemented based on your storage system

  } catch (error) {
    console.error('❌ WEBHOOK: Error retrieving stored attribution:', error)
    return null
  }
}

/**
 * Apply attribution correction using our post-booking correction API
 */
async function applyWebhookAttributionCorrection(
  email: string,
  attributionData: {
    utmParams: UTMParams
    landingPage: string
    referrer: string
    sessionId: string
    timestamp: string
  },
  _contactId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔧 WEBHOOK: Applying attribution correction via internal API...')

    const correctionResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/post-booking-correction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        sessionData: attributionData,
        forceCorrection: true // Force correction since webhook detected the need
      })
    })

    const result = await correctionResponse.json()

    if (result.success) {
      console.log('✅ WEBHOOK: Attribution correction completed successfully')
      return { success: true }
    } else {
      console.error('❌ WEBHOOK: Attribution correction failed:', result.error)
      return { success: false, error: result.error }
    }

  } catch (error) {
    console.error('❌ WEBHOOK: Error applying attribution correction:', error)
    return { success: false, error: (error as Error).message }
  }
}

// GET endpoint for webhook verification and testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get('hub.challenge')

  if (challenge) {
    console.log('🔐 WEBHOOK: Verification challenge received:', challenge)
    // HubSpot webhook verification
    return NextResponse.json(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  }

  return NextResponse.json({
    success: true,
    message: 'HubSpot Webhook Handler - Level 4 Attribution System',
    status: 'active',
    endpoints: {
      POST: 'Processes HubSpot webhook events for attribution correction',
      GET: 'Webhook verification and status endpoint'
    },
    documentation: {
      purpose: 'Server-side attribution sync via HubSpot webhooks',
      events: [
        'contact.creation',
        'contact.propertyChange',
        'meeting.creation'
      ],
      process: [
        '1. Receive webhook from HubSpot',
        '2. Check if contact needs attribution correction',
        '3. Lookup stored attribution data',
        '4. Apply correction via post-booking API',
        '5. Return processing results'
      ]
    }
  })
}