import { NextRequest, NextResponse } from 'next/server'

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_PRIVATE_ACCESS_TOKEN

export async function POST(request: NextRequest) {
  try {
    const { email, utmData, contactId } = await request.json()

    if (!HUBSPOT_ACCESS_TOKEN) {
      throw new Error('HubSpot access token not configured')
    }

    // Si no tenemos contactId, buscamos el contacto por email
    let finalContactId = contactId
    if (!finalContactId && email) {
      const searchResponse = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/search`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filterGroups: [
              {
                filters: [
                  {
                    propertyName: 'email',
                    operator: 'EQ',
                    value: email
                  }
                ]
              }
            ]
          })
        }
      )

      const searchData = await searchResponse.json()
      if (searchData.results && searchData.results.length > 0) {
        finalContactId = searchData.results[0].id
      }
    }

    if (!finalContactId) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Preparar propiedades de atribución para HubSpot
    const properties: Record<string, string> = {}
    const currentTimestamp = Date.now().toString()
    const currentUrl = `https://lahaus.ai/?${new URLSearchParams(utmData).toString()}`

    // CRÍTICO: Propiedades principales de atribución (las que HubSpot usa internamente)
    if (utmData.utm_source) {
      properties['hs_analytics_source'] = utmData.utm_source
      properties['utm_source'] = utmData.utm_source
      // También actualizar la fuente más reciente
      properties['hs_latest_source'] = utmData.utm_source
    }

    if (utmData.utm_medium) {
      properties['hs_analytics_source_data_1'] = utmData.utm_medium
      properties['utm_medium'] = utmData.utm_medium
      properties['hs_latest_source_data_1'] = utmData.utm_medium
    }

    if (utmData.utm_campaign) {
      properties['hs_analytics_source_data_2'] = utmData.utm_campaign
      properties['utm_campaign'] = utmData.utm_campaign
      properties['hs_latest_source_data_2'] = utmData.utm_campaign
    }

    if (utmData.utm_content) {
      properties['utm_content'] = utmData.utm_content
    }

    if (utmData.utm_term) {
      properties['utm_term'] = utmData.utm_term
    }

    // MEJORADO: URLs de atribución (crítico para seguimiento completo)
    properties['hs_analytics_first_url'] = currentUrl
    properties['hs_analytics_last_url'] = currentUrl

    // MEJORADO: Timestamps de atribución
    properties['hs_latest_source_timestamp'] = currentTimestamp

    // MEJORADO: Click IDs si están disponibles (para ads)
    if (utmData.gclid) {
      properties['hs_google_click_id'] = utmData.gclid
    }

    if (utmData.fbclid) {
      properties['hs_facebook_click_id'] = utmData.fbclid
    }

    // MEJORADO: Evento de conversión para tracking de meetings
    properties['recent_conversion_event_name'] = 'Meeting Booked'
    properties['recent_conversion_date'] = currentTimestamp

    // MEJORADO: Lead status y source específico
    properties['hs_lead_status'] = 'NEW'
    properties['engagements_last_meeting_booked_source'] = utmData.utm_source || 'API Attribution Update'

    // Actualizar el contacto en HubSpot
    const updateResponse = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${finalContactId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties
        })
      }
    )

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json()
      throw new Error(`HubSpot API error: ${JSON.stringify(errorData)}`)
    }

    const result = await updateResponse.json()

    return NextResponse.json({
      success: true,
      contactId: finalContactId,
      updatedProperties: properties,
      hubspotResponse: result
    })

  } catch (error) {
    console.error('Error updating HubSpot attribution:', error)
    return NextResponse.json(
      {
        error: 'Failed to update attribution',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}