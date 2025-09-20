#!/usr/bin/env node

/**
 * Prueba con usuario real: sebastian.jimeneztr@gmail.com
 * Ejecutar con: node scripts/test-real-user.js
 */

const PRODUCTION_URL = 'https://www.lahaus.ai'
const REAL_EMAIL = 'sebastian.jimeneztr@gmail.com'

console.log('🎯 PRUEBA CON USUARIO REAL')
console.log('=========================')
console.log(`📧 Email: ${REAL_EMAIL}`)

async function testWithRealUser() {
  // Datos de prueba completos
  const testData = {
    email: REAL_EMAIL,
    utmData: {
      utm_source: 'api_test_real',
      utm_medium: 'manual_validation',
      utm_campaign: 'attribution_fix_2024',
      utm_content: 'real_user_test',
      utm_term: 'hubspot_attribution',
      gclid: 'test_google_click_12345'
    }
  }

  console.log('\n🚀 Enviando datos de atribución completos...')
  console.log('📊 UTM Data:', JSON.stringify(testData.utmData, null, 2))

  try {
    const response = await fetch(`${PRODUCTION_URL}/api/hubspot-attribution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    console.log(`\n📡 Response Status: ${response.status}`)
    const result = await response.json()

    if (response.ok && result.success) {
      console.log('🎉 ¡ÉXITO TOTAL! Atribución actualizada correctamente')
      console.log(`\n📋 Detalles del resultado:`)
      console.log(`   🆔 Contact ID: ${result.contactId}`)
      console.log(`   📊 Propiedades actualizadas: ${Object.keys(result.updatedProperties).length}`)

      console.log('\n🏷️  PROPIEDADES ENVIADAS A HUBSPOT:')
      Object.entries(result.updatedProperties).forEach(([key, value], index) => {
        const icon = key.includes('analytics') ? '🎯' : key.includes('utm') ? '🏷️' : key.includes('google') ? '🔍' : '📌'
        console.log(`   ${icon} ${key}: ${value}`)
      })

      console.log('\n✅ VERIFICACIÓN EN HUBSPOT:')
      console.log('1. Ve a HubSpot → Contacts')
      console.log(`2. Busca: ${REAL_EMAIL}`)
      console.log('3. En la sección "Marketing" deberías ver:')
      console.log('   - Original Traffic Source: api_test_real')
      console.log('   - Original Traffic Source Drill-Down 1: manual_validation')
      console.log('   - Original Traffic Source Drill-Down 2: attribution_fix_2024')
      console.log('   - Google ad click id: test_google_click_12345')
      console.log('   - Recent Conversion: Meeting Booked')

      console.log('\n🎯 ¡YA NO DEBERÍA MOSTRAR "TRÁFICO DIRECTO"!')

    } else if (response.status === 404) {
      console.log('❌ Contacto no encontrado en HubSpot')
      console.log('\n🔧 Soluciones:')
      console.log('1. Verificar que el email existe exactamente así en HubSpot')
      console.log('2. El contacto debe haber sido creado previamente')
      console.log('3. Verificar permisos del Private App')

      console.log('\n💡 ¿Quieres crear el contacto primero?')
      console.log('   Ve a HubSpot → Contacts → Create contact')
      console.log(`   Email: ${REAL_EMAIL}`)
      console.log('   Luego ejecuta este script de nuevo')

    } else {
      console.log('❌ Error en la API')
      console.log('📋 Response:', JSON.stringify(result, null, 2))

      if (response.status === 401) {
        console.log('\n🔧 Problema: Token HubSpot incorrecto o expirado')
      } else if (response.status === 403) {
        console.log('\n🔧 Problema: Permisos insuficientes en HubSpot Private App')
        console.log('   Verificar scopes: crm.objects.contacts.read, crm.objects.contacts.write')
      }
    }

  } catch (error) {
    console.error('\n❌ Error de conexión:', error.message)
  }
}

// Función adicional para verificar si el contacto existe
async function checkContactExists() {
  console.log('\n🔍 Verificando si el contacto existe en HubSpot...')

  try {
    // Llamar a la API solo para verificar
    const response = await fetch(`${PRODUCTION_URL}/api/hubspot-attribution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: REAL_EMAIL,
        utmData: { utm_source: 'test_check' }
      })
    })

    if (response.status === 404) {
      console.log('📭 Contacto NO existe - necesita ser creado primero')
      return false
    } else {
      console.log('✅ Contacto existe - procediendo con actualización')
      return true
    }
  } catch (error) {
    console.log('⚠️ No se pudo verificar existencia del contacto')
    return null
  }
}

// Ejecutar prueba completa
(async () => {
  const exists = await checkContactExists()
  if (exists !== false) {
    await testWithRealUser()
  } else {
    console.log('\n💡 PASOS PARA CONTINUAR:')
    console.log('1. Ve a HubSpot')
    console.log('2. Crea contacto con email: sebastian.jimeneztr@gmail.com')
    console.log('3. Ejecuta: node scripts/test-real-user.js')
  }
})()