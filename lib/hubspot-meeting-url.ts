import { UTMParams } from '@/lib/hubspot-attribution'

interface BuildHubSpotMeetingUrlOptions {
  utmParams: UTMParams
  landingPage?: string
  referrer?: string
  extraParams?: Record<string, string | undefined>
  includeContext?: boolean
}

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
  'fbclid'
] as const

function sanitizeValue(value?: string | null) {
  if (!value) return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function buildHubSpotMeetingUrl(
  baseUrl: string,
  { utmParams, landingPage, referrer, extraParams, includeContext }: BuildHubSpotMeetingUrlOptions
): string {
  const url = new URL(baseUrl)

  UTM_KEYS.forEach(key => {
    const value = sanitizeValue(utmParams[key])
    if (value) {
      url.searchParams.set(key, value)
    }
  })

  if (landingPage) {
    url.searchParams.set('landing_page', landingPage)
  }

  if (referrer) {
    url.searchParams.set('referrer', referrer)
  }

  if (includeContext) {
    const context: Record<string, string | undefined> = {
      source: sanitizeValue(utmParams.utm_source) || 'direct',
      medium: sanitizeValue(utmParams.utm_medium) || 'website',
      campaign: sanitizeValue(utmParams.utm_campaign) || 'default',
      content: sanitizeValue(utmParams.utm_content),
      term: sanitizeValue(utmParams.utm_term),
      referrer: sanitizeValue(referrer),
      landing_page: sanitizeValue(landingPage)
    }

    url.searchParams.set('hs_context', JSON.stringify(context))
  }

  if (extraParams) {
    Object.entries(extraParams).forEach(([key, value]) => {
      const cleaned = sanitizeValue(value)
      if (cleaned) {
        url.searchParams.set(key, cleaned)
      }
    })
  }

  return url.toString()
}
