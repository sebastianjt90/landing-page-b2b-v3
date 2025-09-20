#!/usr/bin/env node

/**
 * Prueba con UTMs reales de Facebook
 * URL: https://www.lahaus.ai/es/vsl?utm_source=facebook&utm_medium=cpc&utm_campaign=Campana_VSL_B2B_col_mx&utm_content=video_ad_2_b2b&fbclid=IwY2xjawM6j_xleHRuA2FlbQEwAGFkaWQBqyfMFSHUGgEej0x-JIwdZIbHEJKSG3WoqziMqZCXOlNB4k5MUtcryTA_24ULH3obTRFGVY0_aem_DN4707O8XZscue7KLgGnNw&utm_id=120232971759520282&utm_term=120232971759530282
 */

const PRODUCTION_URL = 'https://www.lahaus.ai'
const REAL_EMAIL = 'sebastian.jimeneztr@gmail.com'

console.log('🎯 PRUEBA CON UTMs REALES DE FACEBOOK')
console.log('===================================')

async function testWithFacebookUTMs() {
  // Datos exactos de la URL que proporcionaste
  const facebookUTMData = {
    email: REAL_EMAIL,
    utmData: {
      utm_source: 'facebook',
      utm_medium: 'cpc',
      utm_campaign: 'Campana_VSL_B2B_col_mx',
      utm_content: 'video_ad_2_b2b',
      utm_term: '120232971759530282',
      utm_id: '120232971759520282',
      fbclid: 'IwY2xjawM6j_xleHRuA2FlbQEwAGFkaWQBqyfMFSHUGgEej0x-JIwdZIbHEJKSG3WoqziMqZCXOlNB4k5MUtcryTA_24ULH3obTRFGVY0_aem_DN4707O8XZscue7KLgGnNw'
    }
  }

  console.log('📊 UTM Data de Facebook:')
  Object.entries(facebookUTMData.utmData).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`)
  })

  console.log('\n🚀 Enviando datos de Facebook Ads a HubSpot...')

  try {
    const response = await fetch(`${PRODUCTION_URL}/api/hubspot-attribution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(facebookUTMData)
    })

    console.log(`\n📡 Response Status: ${response.status}`)
    const result = await response.json()

    if (response.ok && result.success) {
      console.log('🎉 ¡ÉXITO! UTMs de Facebook enviados correctamente')
      console.log(`\n📋 Resultado:`)
      console.log(`   🆔 Contact ID: ${result.contactId}`)
      console.log(`   📊 Propiedades actualizadas: ${Object.keys(result.updatedProperties).length}`)

      console.log('\n🏷️  PROPIEDADES ACTUALIZADAS EN HUBSPOT:')
      Object.entries(result.updatedProperties).forEach(([key, value]) => {
        let icon = '📌'
        if (key.includes('analytics_source') || key.includes('latest_source')) {
          icon = '🎯'
        } else if (key.includes('facebook')) {
          icon = '📘'
        } else if (key.includes('google')) {
          icon = '🔍'
        } else if (key.includes('timestamp')) {
          icon = '⏰'
        }
        console.log(`   ${icon} ${key}: ${value}`)
      })

      console.log('\n✅ VERIFICACIÓN EN HUBSPOT:')
      console.log(`1. Ve a HubSpot → Contacts → sebastian.jimeneztr@gmail.com`)
      console.log('2. En "Marketing" deberías ver:')
      console.log('   - Original Traffic Source: PAID_SOCIAL (Facebook)')
      console.log('   - Latest Traffic Source: PAID_SOCIAL')
      console.log('   - Facebook click id: IwY2xjawM6j_x... (truncado)')
      console.log('   - Lead Status: WARM')

      console.log('\n🎯 RESULTADO ESPERADO:')
      console.log('✅ YA NO "Tráfico directo"')
      console.log('✅ Ahora muestra: PAID_SOCIAL (Facebook)')
      console.log('✅ Click ID de Facebook capturado')

    } else {
      console.log('❌ Error en la respuesta')
      console.log('📋 Response:', JSON.stringify(result, null, 2))
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message)
  }
}

async function showMappingInfo() {
  console.log('\n📋 INFORMACIÓN SOBRE EL MAPEO:')
  console.log('\n🔄 Cómo se mapean los UTMs de Facebook:')
  console.log('   utm_source=facebook → hs_analytics_source=PAID_SOCIAL')
  console.log('   utm_source=facebook → hs_latest_source=PAID_SOCIAL')
  console.log('   fbclid → hs_facebook_click_id')
  console.log('   → hs_lead_status=WARM')
  console.log('   → hs_latest_source_timestamp=[timestamp]')

  console.log('\n⚠️  LIMITACIONES DESCUBIERTAS:')
  console.log('   ❌ utm_medium, utm_campaign, utm_content NO se pueden guardar directamente')
  console.log('   ❌ Las propiedades analytics_data_1 y analytics_data_2 son READ_ONLY')
  console.log('   ✅ Pero la fuente principal SÍ se actualiza correctamente')

  console.log('\n💡 ALTERNATIVAS PARA GUARDAR MÁS DATOS:')
  console.log('   1. Crear propiedades personalizadas en HubSpot')
  console.log('   2. Usar campos de notas o descripción')
  console.log('   3. Crear actividades/eventos personalizados')
}

// Ejecutar pruebas
(async () => {
  await testWithFacebookUTMs()
  await showMappingInfo()

  console.log('\n🎯 RESUMEN FINAL:')
  console.log('Con esta configuración actual, se envía lo MÁS IMPORTANTE:')
  console.log('✅ Fuente de tráfico (Facebook → PAID_SOCIAL)')
  console.log('✅ Click ID de Facebook para tracking de ads')
  console.log('✅ Estado del lead actualizado')
  console.log('✅ Timestamp de última fuente')
  console.log('')
  console.log('🔮 Para capturar utm_campaign y utm_content necesitaríamos')
  console.log('   crear propiedades personalizadas en HubSpot')
})()