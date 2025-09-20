#!/usr/bin/env node

/**
 * Análisis completo de propiedades de atribución HubSpot
 * Verifica qué propiedades estamos enviando vs las que HubSpot necesita
 */

require('dotenv').config({ path: '.env.local' })

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_PRIVATE_ACCESS_TOKEN

console.log('🔍 ANÁLISIS COMPLETO DE ATRIBUCIÓN HUBSPOT\n')

// Propiedades que estamos enviando actualmente
const CURRENT_MAPPING = {
  utm_source: ['hs_analytics_source', 'utm_source'],
  utm_medium: ['hs_analytics_source_data_1', 'utm_medium'],
  utm_campaign: ['hs_analytics_source_data_2', 'utm_campaign'],
  utm_content: ['utm_content'],
  utm_term: ['utm_term']
}

// Propiedades de atribución críticas de HubSpot (las que realmente importan)
const HUBSPOT_ATTRIBUTION_PROPERTIES = [
  // Fuente original de tráfico (LO MÁS IMPORTANTE)
  'hs_analytics_source',
  'hs_analytics_source_data_1',
  'hs_analytics_source_data_2',

  // Fuente de tráfico más reciente
  'recent_conversion_event_name',
  'recent_conversion_date',

  // Click IDs (automáticos, pero podemos setearlos)
  'hs_google_click_id',
  'hs_facebook_click_id',
  'hs_microsoft_click_id',

  // UTMs estándar
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',

  // Contexto adicional
  'hs_analytics_first_url',
  'hs_analytics_last_url',
  'hs_analytics_num_page_views',
  'hs_analytics_num_visits',
  'hs_analytics_revenue',

  // Timestamps
  'hs_analytics_first_timestamp',
  'hs_analytics_last_timestamp',

  // Lead source específico
  'hs_lead_status',
  'lead_source'
]

async function analyzeHubSpotProperties() {
  if (!HUBSPOT_ACCESS_TOKEN) {
    console.error('❌ HUBSPOT_PRIVATE_ACCESS_TOKEN not found')
    return
  }

  try {
    console.log('📡 Obteniendo todas las propiedades de contacto de HubSpot...')

    const response = await fetch('https://api.hubapi.com/crm/v3/properties/contacts', {
      headers: {
        'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    const properties = data.results

    console.log(`✅ Encontradas ${properties.length} propiedades de contacto total`)

    // Filtrar propiedades de atribución que existen
    const existingAttributionProps = properties.filter(prop =>
      HUBSPOT_ATTRIBUTION_PROPERTIES.includes(prop.name) ||
      prop.name.includes('analytics') ||
      prop.name.includes('utm') ||
      prop.name.includes('source') ||
      prop.name.includes('click')
    )

    console.log(`\n🎯 PROPIEDADES DE ATRIBUCIÓN DISPONIBLES (${existingAttributionProps.length}):\n`)

    existingAttributionProps.forEach(prop => {
      const isUsed = Object.values(CURRENT_MAPPING).flat().includes(prop.name)
      const status = isUsed ? '✅' : '⚠️ '
      console.log(`${status} ${prop.name} - ${prop.label || 'Sin descripción'}`)
    })

    // Análisis de propiedades críticas faltantes
    console.log('\n🔍 ANÁLISIS DETALLADO:\n')

    const criticalMissing = []
    const criticalProps = [
      'hs_analytics_source',
      'hs_analytics_source_data_1',
      'hs_analytics_source_data_2',
      'hs_analytics_first_url',
      'hs_analytics_last_url',
      'recent_conversion_event_name'
    ]

    criticalProps.forEach(propName => {
      const exists = existingAttributionProps.find(p => p.name === propName)
      const weUse = Object.values(CURRENT_MAPPING).flat().includes(propName)

      if (exists) {
        console.log(`✅ ${propName}: ${weUse ? 'ENVIAMOS' : 'NO ENVIAMOS'} - ${exists.label}`)
        if (!weUse && propName.includes('analytics')) {
          criticalMissing.push(propName)
        }
      } else {
        console.log(`❌ ${propName}: NO EXISTE en HubSpot`)
      }
    })

    // Recomendaciones
    console.log('\n📋 RECOMENDACIONES:\n')

    console.log('🎯 Propiedades CRÍTICAS que deberíamos agregar:')
    if (criticalMissing.length > 0) {
      criticalMissing.forEach(prop => {
        console.log(`   - ${prop}`)
      })
    } else {
      console.log('   ✅ Ya enviamos todas las propiedades críticas')
    }

    // Propiedades adicionales que podrían mejorar la atribución
    console.log('\n🔧 Propiedades ADICIONALES que mejorarían la atribución:')

    const additionalProps = existingAttributionProps
      .filter(prop =>
        (prop.name.includes('first') || prop.name.includes('last') || prop.name.includes('recent')) &&
        !Object.values(CURRENT_MAPPING).flat().includes(prop.name)
      )
      .slice(0, 5)

    if (additionalProps.length > 0) {
      additionalProps.forEach(prop => {
        console.log(`   ⚡ ${prop.name} - ${prop.label}`)
      })
    }

    // Click IDs que podríamos capturar
    console.log('\n🖱️  CLICK IDs que podríamos capturar:')
    const clickIdProps = ['hs_google_click_id', 'hs_facebook_click_id', 'hs_microsoft_click_id']
    clickIdProps.forEach(clickId => {
      const exists = existingAttributionProps.find(p => p.name === clickId)
      if (exists) {
        console.log(`   📍 ${clickId} - Disponible para gclid, fbclid, msclkid`)
      }
    })

    console.log('\n✨ CONCLUSIÓN:')
    console.log('Estamos enviando las propiedades más importantes para atribución básica.')
    console.log('Para atribución avanzada, considerar agregar las propiedades adicionales.')

  } catch (error) {
    console.error('❌ Error al analizar propiedades:', error.message)
  }
}

analyzeHubSpotProperties()