'use client'

import { useState, useEffect } from 'react'
import { useAttribution } from '@/hooks/use-attribution'
import { usePreAttribution } from '@/hooks/use-pre-attribution'
import { BookingModal } from '@/components/booking-modal'
import { VSLBookingModal } from '@/components/vsl-booking-modal'

interface AttributionTestContentProps {
  locale: string
}

export function AttributionTestContent({ locale }: AttributionTestContentProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isVSLModalOpen, setIsVSLModalOpen] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [testEmail, setTestEmail] = useState('test@attribution-demo.com')

  const { utmParams, landingPage, referrer, submitAttribution } = useAttribution()
  const { preRegisterLead, getPreAttributionData, isPreRegistering } = usePreAttribution()

  const addTestResult = (test: string, result: any) => {
    setTestResults(prev => [...prev, {
      timestamp: new Date().toISOString(),
      test,
      result
    }])
  }

  // Level 1 Test: Pre-Attribution
  const testLevel1PreAttribution = async () => {
    console.log('🧪 TESTING LEVEL 1: Pre-Attribution System')
    try {
      const result = await preRegisterLead()
      addTestResult('Level 1: Pre-Attribution', result)
      console.log('✅ Level 1 Test Result:', result)
    } catch (error) {
      addTestResult('Level 1: Pre-Attribution', { success: false, error: (error as Error).message })
      console.error('❌ Level 1 Test Error:', error)
    }
  }

  // Level 2 Test: Enhanced iframe integration
  const testLevel2EnhancedIframe = async () => {
    console.log('🧪 TESTING LEVEL 2: Enhanced Iframe Integration')

    // Test iframe URL building
    const baseUrl = 'https://meetings.hubspot.com/test/demo'
    const url = new URL(baseUrl)

    // Add UTM parameters
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value)
    })

    // Add HubSpot-specific parameters
    const hsContext = {
      source: utmParams.utm_source || 'test',
      medium: utmParams.utm_medium || 'test',
      campaign: utmParams.utm_campaign || 'test'
    }

    url.searchParams.set('hs_context', JSON.stringify(hsContext))
    url.searchParams.set('hsCtaTracking', 'test_enabled')
    url.searchParams.set('hs_attribution_source', utmParams.utm_source || 'test')

    const enhancedUrl = url.toString()

    const result = {
      success: true,
      originalUrl: baseUrl,
      enhancedUrl,
      utmParams,
      hsContext,
      parametersAdded: url.searchParams.toString().split('&').length
    }

    addTestResult('Level 2: Enhanced Iframe', result)
    console.log('✅ Level 2 Test Result:', result)
  }

  // Level 3 Test: Post-booking correction
  const testLevel3PostBookingCorrection = async () => {
    console.log('🧪 TESTING LEVEL 3: Post-Booking Attribution Correction')

    try {
      const sessionData = {
        utmParams,
        landingPage,
        referrer,
        sessionId: `test-${Date.now()}`,
        timestamp: new Date().toISOString()
      }

      const response = await fetch('/api/post-booking-correction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testEmail,
          sessionData,
          forceCorrection: true
        })
      })

      const result = await response.json()
      addTestResult('Level 3: Post-Booking Correction', result)
      console.log('✅ Level 3 Test Result:', result)
    } catch (error) {
      addTestResult('Level 3: Post-Booking Correction', { success: false, error: (error as Error).message })
      console.error('❌ Level 3 Test Error:', error)
    }
  }

  // Level 4 Test: Webhook handler
  const testLevel4WebhookHandler = async () => {
    console.log('🧪 TESTING LEVEL 4: HubSpot Webhook Handler')

    try {
      // Test the webhook handler with a mock payload
      const mockWebhookPayload = {
        events: [{
          eventId: 12345,
          subscriptionId: 67890,
          portalId: 123456,
          appId: 789,
          eventName: 'contact.creation',
          subscriptionType: 'contact.creation',
          objectId: 156825337923, // Use the test contact ID from logs
          changeSource: 'CRM_UI',
          eventTime: Date.now()
        }]
      }

      const response = await fetch('/api/hubspot-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockWebhookPayload)
      })

      const result = await response.json()
      addTestResult('Level 4: Webhook Handler', result)
      console.log('✅ Level 4 Test Result:', result)
    } catch (error) {
      addTestResult('Level 4: Webhook Handler', { success: false, error: (error as Error).message })
      console.error('❌ Level 4 Test Error:', error)
    }
  }

  // Full Integration Test
  const testFullAttributionFlow = async () => {
    console.log('🧪 TESTING FULL ATTRIBUTION FLOW')

    try {
      // Step 1: Test attribution API
      const result = await submitAttribution({
        email: testEmail,
        firstname: 'Attribution',
        lastname: 'Test'
      })

      addTestResult('Full Flow: Attribution API', result)
      console.log('✅ Full Flow Test Result:', result)
    } catch (error) {
      addTestResult('Full Flow: Attribution API', { success: false, error: (error as Error).message })
      console.error('❌ Full Flow Test Error:', error)
    }
  }

  const clearTestResults = () => {
    setTestResults([])
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎯 4-Level Attribution System Test
        </h1>
        <p className="text-gray-600 mb-6">
          Comprehensive testing suite for the complete attribution system that solves the "Direct Traffic" problem.
        </p>

        {/* Current Attribution Status */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">📊 Current Attribution Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>UTM Source:</strong> {utmParams.utm_source || 'Not set'}
            </div>
            <div>
              <strong>UTM Medium:</strong> {utmParams.utm_medium || 'Not set'}
            </div>
            <div>
              <strong>UTM Campaign:</strong> {utmParams.utm_campaign || 'Not set'}
            </div>
            <div>
              <strong>UTM Content:</strong> {utmParams.utm_content || 'Not set'}
            </div>
            <div>
              <strong>Landing Page:</strong> {landingPage || 'Not set'}
            </div>
            <div>
              <strong>Referrer:</strong> {referrer || 'Not set'}
            </div>
          </div>
        </div>

        {/* Test Email Configuration */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">⚙️ Test Configuration</h3>
          <div className="flex items-center gap-4">
            <label htmlFor="test-email" className="text-sm font-medium text-gray-700">
              Test Email:
            </label>
            <input
              id="test-email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="test@example.com"
            />
          </div>
        </div>

        {/* Level Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Level 1 */}
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <h3 className="font-semibold text-green-900 mb-2">Level 1</h3>
            <p className="text-sm text-green-700 mb-3">Pre-Attribution System</p>
            <button
              onClick={testLevel1PreAttribution}
              disabled={isPreRegistering}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              {isPreRegistering ? 'Testing...' : 'Test Level 1'}
            </button>
          </div>

          {/* Level 2 */}
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <h3 className="font-semibold text-blue-900 mb-2">Level 2</h3>
            <p className="text-sm text-blue-700 mb-3">Enhanced Iframe Integration</p>
            <button
              onClick={testLevel2EnhancedIframe}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              Test Level 2
            </button>
          </div>

          {/* Level 3 */}
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <h3 className="font-semibold text-orange-900 mb-2">Level 3</h3>
            <p className="text-sm text-orange-700 mb-3">Post-Booking Correction</p>
            <button
              onClick={testLevel3PostBookingCorrection}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              Test Level 3
            </button>
          </div>

          {/* Level 4 */}
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <h3 className="font-semibold text-purple-900 mb-2">Level 4</h3>
            <p className="text-sm text-purple-700 mb-3">Webhook Integration</p>
            <button
              onClick={testLevel4WebhookHandler}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              Test Level 4
            </button>
          </div>
        </div>

        {/* Integration Tests */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={testFullAttributionFlow}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-md font-medium transition-colors"
          >
            🚀 Test Full Attribution Flow
          </button>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-md font-medium transition-colors"
          >
            📅 Test Booking Modal
          </button>

          <button
            onClick={() => setIsVSLModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md font-medium transition-colors"
          >
            🎥 Test VSL Modal
          </button>

          <button
            onClick={clearTestResults}
            className="bg-gray-400 hover:bg-gray-500 text-white py-3 px-6 rounded-md font-medium transition-colors"
          >
            🗑️ Clear Results
          </button>
        </div>

        {/* Pre-Attribution Status */}
        <div className="bg-yellow-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">📋 Pre-Attribution Status</h3>
          <div className="text-sm text-yellow-800">
            {getPreAttributionData() ? (
              <div>
                <p><strong>Session ID:</strong> {getPreAttributionData()?.sessionId}</p>
                <p><strong>Timestamp:</strong> {getPreAttributionData()?.timestamp}</p>
                <p><strong>Email:</strong> {getPreAttributionData()?.email}</p>
              </div>
            ) : (
              <p>No pre-attribution data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Test Results</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{result.test}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documentation */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 System Documentation</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Problem Solved</h3>
            <p className="text-gray-700">
              This 4-level attribution system completely eliminates the "Direct Traffic" problem in HubSpot
              by ensuring attribution data is captured and applied through multiple redundant mechanisms.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🏗️ Architecture Overview</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-green-400 pl-4">
                <strong className="text-green-700">Level 1: Pre-Attribution</strong>
                <p className="text-gray-600">Captures UTM data before user opens booking modal</p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <strong className="text-blue-700">Level 2: Enhanced Iframe</strong>
                <p className="text-gray-600">Injects HubSpot-specific tracking parameters into iframe URLs</p>
              </div>
              <div className="border-l-4 border-orange-400 pl-4">
                <strong className="text-orange-700">Level 3: Post-Booking Correction</strong>
                <p className="text-gray-600">Detects and corrects "Direct Traffic" attribution after booking</p>
              </div>
              <div className="border-l-4 border-purple-400 pl-4">
                <strong className="text-purple-700">Level 4: Webhook Integration</strong>
                <p className="text-gray-600">Server-side attribution sync via HubSpot webhooks</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔧 Testing URLs</h3>
            <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
              <p><strong>With UTMs:</strong> /es?utm_source=test&utm_medium=attribution&utm_campaign=system_test</p>
              <p><strong>Webhook Test:</strong> /api/hubspot-webhook</p>
              <p><strong>Correction API:</strong> /api/post-booking-correction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        locale={locale}
      />

      <VSLBookingModal
        isOpen={isVSLModalOpen}
        onClose={() => setIsVSLModalOpen(false)}
      />
    </div>
  )
}