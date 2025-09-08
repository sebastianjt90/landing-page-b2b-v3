'use client'

import { useEffect, useState } from 'react'

interface GTMStatus {
  isLoaded: boolean
  dataLayerExists: boolean
  gtmId: string | null
  eventsCount: number
  lastEvent: Record<string, unknown> | null
}

// Type is now declared globally in types/gtm.d.ts

export function GTMDebugger() {
  const [status, setStatus] = useState<GTMStatus>({
    isLoaded: false,
    dataLayerExists: false,
    gtmId: null,
    eventsCount: 0,
    lastEvent: null
  })

  useEffect(() => {
    const checkGTM = () => {
      // Check if dataLayer exists
      const dataLayerExists = typeof window.dataLayer !== 'undefined'
      
      // Check if GTM is loaded
      const isLoaded = dataLayerExists && window.dataLayer.length > 0
      
      // Get GTM ID from dataLayer
      let gtmId: string | null = null
      if (dataLayerExists && window.dataLayer.length > 0) {
        const gtmStart = window.dataLayer.find((item) => 'gtm.start' in item)
        if (gtmStart) {
          // Try to extract GTM ID from scripts
          const scripts = document.querySelectorAll('script[src*="googletagmanager"]')
          scripts.forEach((script) => {
            const scriptElement = script as HTMLScriptElement
            const match = scriptElement.src.match(/id=(GTM-[A-Z0-9]+)/)
            if (match) {
              gtmId = match[1]
            }
          })
        }
      }
      
      // Get events count
      const eventsCount = dataLayerExists ? window.dataLayer.length : 0
      
      // Get last event
      const lastEvent = dataLayerExists && window.dataLayer.length > 0 
        ? window.dataLayer[window.dataLayer.length - 1] 
        : null
      
      setStatus({
        isLoaded,
        dataLayerExists,
        gtmId,
        eventsCount,
        lastEvent
      })
    }
    
    // Check immediately
    checkGTM()
    
    // Check periodically for updates
    const interval = setInterval(checkGTM, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg max-w-sm text-xs font-mono z-50">
      <h3 className="font-bold mb-2">GTM Debug</h3>
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">Status:</span>{' '}
          <span className={status.isLoaded ? 'text-green-400' : 'text-red-400'}>
            {status.isLoaded ? 'Loaded' : 'Not Loaded'}
          </span>
        </div>
        <div>
          <span className="text-gray-400">DataLayer:</span>{' '}
          <span className={status.dataLayerExists ? 'text-green-400' : 'text-red-400'}>
            {status.dataLayerExists ? 'Exists' : 'Missing'}
          </span>
        </div>
        <div>
          <span className="text-gray-400">GTM ID:</span>{' '}
          <span className="text-blue-400">{status.gtmId || 'Not found'}</span>
        </div>
        <div>
          <span className="text-gray-400">Events:</span>{' '}
          <span className="text-yellow-400">{status.eventsCount}</span>
        </div>
        {status.lastEvent && (
          <div>
            <span className="text-gray-400">Last Event:</span>
            <pre className="text-xs mt-1 text-green-300 overflow-x-auto">
              {JSON.stringify(status.lastEvent, null, 2).substring(0, 200)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}