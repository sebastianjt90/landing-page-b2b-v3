#!/usr/bin/env node

/**
 * Prueba súper rápida de la API de atribución
 * Ejecutar con: node scripts/quick-test.js
 */

const PRODUCTION_URL = 'https://www.lahaus.ai'

console.log('🚀 PRUEBA RÁPIDA DE LA API DE ATRIBUCIÓN\n')

async function quickTest() {
  const testData = {
    email: 'test@nonexistent.com',
    utmData: {
      utm_source: 'quick_test',
      utm_medium: 'script',
      utm_campaign: 'validation'
    }
  }

  console.log('📡 Probando API en producción...')
  console.log(`🌐 URL: ${PRODUCTION_URL}/api/hubspot-attribution`)
  console.log('📊 Datos:', JSON.stringify(testData, null, 2))

  try {
    const response = await fetch(`${PRODUCTION_URL}/api/hubspot-attribution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    console.log(`\n📡 Status: ${response.status}`)

    const result = await response.json()
    console.log('📋 Response:', JSON.stringify(result, null, 2))

    // Interpretar resultado
    if (response.status === 404 && result.error === 'Contact not found') {
      console.log('\n✅ ¡PERFECTO! La API está funcionando correctamente')
      console.log('   El error "Contact not found" es esperado')
      console.log('   Significa que la API, HubSpot y autenticación funcionan')

      console.log('\n🧪 Para probar con contacto real:')
      console.log('   1. Crea contacto en HubSpot con email conocido')
      console.log('   2. Ejecuta: node scripts/test-with-real-contact.js')

    } else if (response.ok && result.success) {
      console.log('\n🎉 ¡ÉXITO TOTAL! Contacto actualizado correctamente')
      console.log(`   Contacto ID: ${result.contactId}`)
      console.log('   Propiedades actualizadas:', Object.keys(result.updatedProperties).length)

    } else {
      console.log('\n❌ Error inesperado')
      console.log('🔧 Posibles causas:')
      if (response.status === 401) {
        console.log('   - Token HubSpot incorrecto o expirado')
      } else if (response.status === 403) {
        console.log('   - Permisos insuficientes en HubSpot Private App')
      } else if (response.status === 500) {
        console.log('   - Error interno del servidor')
      }
    }

  } catch (error) {
    console.error('\n❌ Error de conexión:', error.message)
    console.log('\n🔧 Verificar:')
    console.log('   - Conexión a internet')
    console.log('   - El sitio está accesible')
    console.log('   - No hay firewall bloqueando')
  }
}

// Ejecutar prueba
quickTest()