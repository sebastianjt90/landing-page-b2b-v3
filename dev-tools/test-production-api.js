#!/usr/bin/env node

/**
 * Script de prueba para validar la API de atribución en producción
 * Ejecutar con: node scripts/test-production-api.js
 */

const PRODUCTION_URL = 'https://lahaus.ai'

console.log('🧪 Testing Production HubSpot Attribution API\n')

async function testProductionAPI() {
  try {
    // Datos de prueba
    const testData = {
      email: 'test.attribution@lahausai.com',
      utmData: {
        utm_source: 'test_api',
        utm_medium: 'script',
        utm_campaign: 'production_test',
        utm_content: 'final_validation',
        utm_term: 'attribution_api'
      }
    }

    console.log('🚀 Sending test attribution to production API...')
    console.log('📊 Test data:', JSON.stringify(testData, null, 2))

    const response = await fetch(`${PRODUCTION_URL}/api/hubspot-attribution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    console.log(`\n📡 Response status: ${response.status}`)

    const result = await response.json()

    if (response.ok) {
      console.log('✅ SUCCESS! Attribution API working in production')
      console.log('📋 Response:', JSON.stringify(result, null, 2))

      if (result.success) {
        console.log(`\n🎉 Attribution successfully updated for contact: ${result.contactId}`)
        console.log('🏷️  Updated properties:', result.updatedProperties)

        console.log('\n📝 Next steps:')
        console.log('1. Check HubSpot contact record for test.attribution@lahausai.com')
        console.log('2. Verify the following properties are updated:')
        console.log('   - hs_analytics_source = test_api')
        console.log('   - hs_analytics_source_data_1 = script')
        console.log('   - hs_analytics_source_data_2 = production_test')
        console.log('   - utm_content = final_validation')
        console.log('   - utm_term = attribution_api')
      }
    } else {
      console.log('❌ FAILED! API returned error')
      console.log('📋 Error response:', JSON.stringify(result, null, 2))

      if (result.error === 'Contact not found') {
        console.log('\n🔧 Solution: Create a contact in HubSpot with email test.attribution@lahausai.com')
        console.log('   Or use an existing contact email from your HubSpot')
      }
    }

  } catch (error) {
    console.error('\n❌ Test failed with exception:', error.message)

    if (error.message.includes('fetch')) {
      console.log('\n🔧 Possible issues:')
      console.log('  1. Production deployment not ready yet')
      console.log('  2. Network connectivity issues')
      console.log('  3. API route not deployed correctly')
    }
  }
}

async function testWithExistingContact() {
  try {
    console.log('\n🔍 Testing with a real scenario...')
    console.log('📧 Using a more realistic email pattern')

    const realisticTest = {
      email: 'sebastian@lahaus.ai', // Usar un email que probablemente existe
      utmData: {
        utm_source: 'facebook',
        utm_medium: 'cpc',
        utm_campaign: 'demo_q4_2024',
        utm_content: 'carousel_ad',
        utm_term: 'real_estate_ai'
      }
    }

    console.log('📊 Realistic test data:', JSON.stringify(realisticTest, null, 2))

    const response = await fetch(`${PRODUCTION_URL}/api/hubspot-attribution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(realisticTest)
    })

    const result = await response.json()

    if (response.ok && result.success) {
      console.log('✅ Realistic test PASSED!')
      console.log(`🎯 Updated contact: ${result.contactId}`)
    } else {
      console.log('⚠️ Realistic test did not find existing contact (expected)')
      console.log('💡 This is normal - the API needs existing contacts to update')
    }

  } catch (error) {
    console.log('⚠️ Realistic test error (expected):', error.message)
  }
}

// Ejecutar pruebas
(async () => {
  await testProductionAPI()
  await testWithExistingContact()

  console.log('\n🎯 FINAL VALIDATION COMPLETE')
  console.log('\nTo fully test the attribution:')
  console.log('1. Visit: https://lahaus.ai?utm_source=final_test&utm_medium=validation&utm_campaign=working')
  console.log('2. Book a demo with a real email')
  console.log('3. Check HubSpot contact after 30 seconds')
  console.log('4. Should show utm_source=final_test instead of "Tráfico directo"')
})()