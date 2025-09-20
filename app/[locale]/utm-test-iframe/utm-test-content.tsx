'use client'

import { useState } from 'react'
import { BookingModal } from '@/components/booking-modal'
import { VSLBookingModal } from '@/components/vsl-booking-modal'

export function UTMTestContent({ locale }: { locale: string }) {
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showVSLModal, setShowVSLModal] = useState(false)

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🎯 Test UTM Iframe Integration</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 Current URL Parameters</h2>
          <div className="bg-gray-100 rounded p-4 font-mono text-sm">
            {typeof window !== 'undefined' ? window.location.href : 'Loading...'}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">🗓️ Regular Booking Modal</h3>
            <p className="text-gray-600 mb-4">
              Tests the main booking modal with dynamic iframe UTM injection
            </p>
            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Open Booking Modal
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">🎥 VSL Booking Modal</h3>
            <p className="text-gray-600 mb-4">
              Tests the VSL booking modal with dynamic iframe UTM injection
            </p>
            <button
              onClick={() => setShowVSLModal(true)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
            >
              Open VSL Modal
            </button>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">🧪 Test Instructions</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Add UTM parameters to the URL: <code>?utm_source=facebook&utm_medium=cpc&utm_campaign=iframe_test&utm_content=test</code></li>
            <li>Open Developer Tools (F12) → Console tab</li>
            <li>Click one of the buttons above to open a modal</li>
            <li>Look for console logs showing:</li>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li><code>🔧 Building iframe URL with UTMs...</code></li>
              <li><code>✅ Added utm_source=facebook to iframe URL</code></li>
              <li><code>🎯 IFRAME SRC SET WITH UTMs: [URL with UTMs]</code></li>
            </ul>
          </ol>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">🔍 What to Look For</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Console logs showing UTM parameters being added to iframe URL</li>
            <li>HubSpot meeting iframe should load with UTM parameters in its URL</li>
            <li>The iframe URL should include all UTM parameters from this page&apos;s URL</li>
            <li>Attribution system should capture UTMs when booking is made</li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        locale={locale}
      />

      <VSLBookingModal
        isOpen={showVSLModal}
        onClose={() => setShowVSLModal(false)}
      />
    </>
  )
}