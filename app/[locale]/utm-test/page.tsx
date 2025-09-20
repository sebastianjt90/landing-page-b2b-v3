'use client'

import { useState, use } from 'react'
import { Button } from '@/components/ui/button'
import { BookingModal } from '@/components/booking-modal'
import { debugUTMCapture, captureTrackingParams, buildMeetingUrlWithCurrentParams, captureAndSendUTMsToHubSpot, captureAndSendUTMsToHubSpotAsync } from '@/lib/utm-utils'
import { translations } from '@/lib/translations'

interface UTMTestPageProps {
  params: Promise<{ locale: string }>
}

export default function UTMTestPage({ params }: UTMTestPageProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const { locale: localeParam } = use(params)
  const locale = localeParam === 'en' ? 'en' : 'es'
  const t = translations[locale]

  const runUTMTest = () => {
    console.log('🧪 MANUAL UTM TEST TRIGGERED')
    debugUTMCapture()

    // Test meeting URL building
    const baseUrl = t.booking.meetingUrl
    const urlWithUtms = buildMeetingUrlWithCurrentParams(baseUrl)

    console.log('🔗 Base Meeting URL:', baseUrl)
    console.log('🔗 Meeting URL with UTMs:', urlWithUtms)

    // Show current tracking params
    const trackingParams = captureTrackingParams()
    console.log('📊 Current Tracking Params Object:', trackingParams)

    // Test HubSpot tracking with delay (in case script is still loading)
    console.log('🎯 Testing HubSpot Tracking (Sync)...')
    const trackingSent = captureAndSendUTMsToHubSpot()
    console.log(`📡 HubSpot Tracking Result (Sync): ${trackingSent ? 'SUCCESS ✅' : 'FAILED ❌'}`)

    // Try async version with polling
    console.log('🎯 Testing HubSpot Tracking (Async with Polling)...')
    captureAndSendUTMsToHubSpotAsync().then(asyncResult => {
      console.log(`📡 HubSpot Tracking Result (Async): ${asyncResult ? 'SUCCESS ✅' : 'FAILED ❌'}`)
    })

    // Legacy retry after delay
    setTimeout(() => {
      console.log('🔄 Retrying HubSpot tracking after 3 seconds (Legacy)...')
      const retryResult = captureAndSendUTMsToHubSpot()
      console.log(`📡 Retry Result (Legacy): ${retryResult ? 'SUCCESS ✅' : 'FAILED ❌'}`)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            UTM Tracking Test Page
          </h1>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                🧪 Test Instructions
              </h2>
              <div className="text-blue-800 space-y-2">
                <p>1. Add UTM parameters to this URL:</p>
                <code className="block bg-blue-100 p-2 rounded text-sm">
                  ?utm_source=test&utm_medium=debug&utm_campaign=utm_testing&utm_content=test_page
                </code>
                <p>2. Click &quot;Run UTM Test&quot; to see debug information in console</p>
                <p>3. Click &quot;Open Booking Modal&quot; to test the integration</p>
                <p>4. Open browser console (F12) to see detailed logs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={runUTMTest}
                variant="outline"
                size="lg"
                className="h-16"
              >
                🔍 Run UTM Test (Check Console)
              </Button>

              <Button
                onClick={() => setIsBookingModalOpen(true)}
                size="lg"
                className="h-16 bg-[#00251D] hover:bg-[#00251D]/90 text-white"
              >
                📅 Open Booking Modal
              </Button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-900 mb-4">
                📋 What to Look For
              </h2>
              <div className="text-yellow-800 space-y-2 text-sm">
                <p>• <strong>Current URL</strong>: Should show UTM parameters</p>
                <p>• <strong>Captured Tracking Parameters</strong>: Should extract UTMs from URL</p>
                <p>• <strong>Meeting URL with UTMs</strong>: Should include captured UTMs</p>
                <p>• <strong>Iframe src</strong>: Should load with UTM parameters included</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                ✅ Expected Results
              </h2>
              <div className="text-green-800 space-y-2 text-sm">
                <p>• Console should show detailed UTM capture information</p>
                <p>• Meeting URL should include all UTM parameters</p>
                <p>• HubSpot meeting iframe should load with attribution data</p>
                <p>• No JavaScript errors in console</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        locale={locale}
      />
    </div>
  )
}