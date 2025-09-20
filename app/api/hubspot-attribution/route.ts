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

    // Mapear UTM source a valores permitidos por HubSpot
    const mapSourceToHubSpotValue = (source: string): string => {
      const sourceMap: Record<string, string> = {
        'facebook': 'PAID_SOCIAL',
        'google': 'PAID_SEARCH',
        'linkedin': 'PAID_SOCIAL',
        'email': 'EMAIL_MARKETING',
        'organic': 'ORGANIC_SEARCH',
        'referral': 'REFERRALS',
        'direct': 'DIRECT_TRAFFIC',
        'api_test_real': 'OTHER_CAMPAIGNS',
        'test': 'OTHER_CAMPAIGNS'
      }

      // Buscar coincidencia en el source
      for (const [key, value] of Object.entries(sourceMap)) {
        if (source.toLowerCase().includes(key)) {
          return value
        }
      }

      return 'OTHER_CAMPAIGNS' // Default fallback
    }

    // Mapear lead status a valores permitidos
    const mapLeadStatus = (): string => {
      return 'WARM' // Usar WARM en lugar de NEW
    }

    // CRÍTICO: Solo usar propiedades que SÍ se pueden escribir
    if (utmData.utm_source) {
      const hubspotSource = mapSourceToHubSpotValue(utmData.utm_source)
      properties['hs_analytics_source'] = hubspotSource
      properties['hs_latest_source'] = hubspotSource
    }

    // MEJORADO: Click IDs (estas SÍ funcionan)
    if (utmData.gclid) {
      properties['hs_google_click_id'] = utmData.gclid
    }

    if (utmData.fbclid) {
      properties['hs_facebook_click_id'] = utmData.fbclid
    }

    // MEJORADO: Lead status con valor válido
    properties['hs_lead_status'] = mapLeadStatus()

    // MEJORADO: Timestamp de fuente más reciente (esta SÍ se puede escribir)
    properties['hs_latest_source_timestamp'] = Date.now().toString()

    // NOTE: Removidas las propiedades que son READ_ONLY según el error:
    // - hs_analytics_source_data_1 (READ_ONLY)
    // - hs_analytics_source_data_2 (READ_ONLY)
    // - hs_analytics_first_url (READ_ONLY)
    // - hs_analytics_last_url (READ_ONLY)
    // - hs_latest_source_data_1 (READ_ONLY)
    // - hs_latest_source_data_2 (READ_ONLY)
    // - recent_conversion_event_name (CALCULATED)
    // - recent_conversion_date (CALCULATED)
    // - engagements_last_meeting_booked_source (READ_ONLY)

    // NOTE: Removidas las propiedades UTM que no existen:
    // - utm_source, utm_medium, utm_campaign, utm_content, utm_term
    // Estas propiedades aparentemente no existen como campos editables en este HubSpot

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