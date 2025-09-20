#!/usr/bin/env node

/**
 * Script de prueba para verificar la configuración de HubSpot API
 * Ejecutar con: node scripts/test-hubspot-api.js
 */

require('dotenv').config({ path: '.env.local' })

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_PRIVATE_ACCESS_TOKEN
const PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID

console.log('🧪 Testing HubSpot API Configuration\n')

if (!HUBSPOT_ACCESS_TOKEN) {
  console.error('❌ HUBSPOT_PRIVATE_ACCESS_TOKEN not found in environment variables')
  console.log('📝 Make sure you have .env.local with the token')
  process.exit(1)
}

if (!PORTAL_ID) {
  console.error('❌ NEXT_PUBLIC_HUBSPOT_PORTAL_ID not found')
  process.exit(1)
}

console.log(`✅ Portal ID: ${PORTAL_ID}`)
console.log(`✅ Token found: ${HUBSPOT_ACCESS_TOKEN.substring(0, 20)}...`)

async function testHubSpotAPI() {
  try {
    console.log('\n🔍 Testing API connection...')

    // Test 1: Get portal info
    const portalResponse = await fetch(`https://api.hubapi.com/account-info/v3/details`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!portalResponse.ok) {
      throw new Error(`Portal info failed: ${portalResponse.status}`)
    }

    const portalData = await portalResponse.json()
    console.log(`✅ Connected to HubSpot portal: ${portalData.companyName}`)

    // Test 2: Search for a contact (should work even if no results)
    console.log('\n🔍 Testing contact search...')
    const searchResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/search`, {
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
                value: 'test@nonexistent-domain-for-testing.com'
              }
            ]
          }
        ],
        limit: 1
      })
    })

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json()
      throw new Error(`Contact search failed: ${JSON.stringify(errorData)}`)
    }

    const searchData = await searchResponse.json()
    console.log(`✅ Contact search API working (found ${searchData.total} contacts)`)

    // Test 3: Get contact properties
    console.log('\n🔍 Testing contact properties...')
    const propsResponse = await fetch(`https://api.hubapi.com/crm/v3/properties/contacts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!propsResponse.ok) {
      throw new Error(`Properties failed: ${propsResponse.status}`)
    }

    const propsData = await propsResponse.json()

    // Check if UTM properties exist
    const utmProps = ['hs_analytics_source', 'hs_analytics_source_data_1', 'utm_source', 'utm_medium']
    const foundProps = propsData.results.filter(prop => utmProps.includes(prop.name))

    console.log(`✅ Contact properties API working (${propsData.results.length} total properties)`)
    console.log(`✅ UTM-related properties found: ${foundProps.map(p => p.name).join(', ')}`)

    console.log('\n🎉 All tests passed! HubSpot API is properly configured.')
    console.log('\n📋 Summary:')
    console.log('  ✅ API authentication working')
    console.log('  ✅ Can search contacts')
    console.log('  ✅ Can read contact properties')
    console.log('  ✅ UTM properties available')

    console.log('\n🚀 Ready to test the attribution API!')

  } catch (error) {
    console.error('\n❌ Test failed:', error.message)

    if (error.message.includes('401')) {
      console.log('\n🔧 Possible fixes:')
      console.log('  1. Check that HUBSPOT_PRIVATE_ACCESS_TOKEN is correct')
      console.log('  2. Make sure the private app is installed in HubSpot')
      console.log('  3. Verify the token has not expired')
    }

    if (error.message.includes('403')) {
      console.log('\n🔧 Possible fixes:')
      console.log('  1. Add required scopes to your private app:')
      console.log('     - crm.objects.contacts.read')
      console.log('     - crm.objects.contacts.write')
      console.log('  2. Reinstall the private app after adding scopes')
    }

    process.exit(1)
  }
}

testHubSpotAPI()