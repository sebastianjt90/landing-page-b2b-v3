import type { Metadata } from 'next'

export const baseMetadata: Metadata = {
  metadataBase: new URL('https://lahaus.ai'),
  title: {
    default: 'LaHaus AI',
    template: '%s | LaHaus AI'
  },
  description: 'Asistente IA que responde en segundos y agenda más citas automáticamente. Desarrolladores e inmobiliarias han incrementado sus ventas hasta un 35%.',
  keywords: [
    'AI para inmobiliarias',
    'asistente virtual inmobiliario',
    'chatbot inmobiliario',
    'automatización inmobiliaria',
    'LaHaus AI',
    'real estate AI',
    'agendamiento automático',
    'calificación de leads'
  ],
  authors: [{ name: 'LaHaus AI' }],
  creator: 'LaHaus AI',
  publisher: 'LaHaus AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'LaHaus AI',
    description: 'Asistente IA que responde en segundos y agenda más citas automáticamente. Incrementa tus ventas hasta un 35%.',
    url: 'https://lahaus.ai',
    siteName: 'LaHaus AI',
    images: [
      {
        url: '/og-image.png', // Necesitarás crear esta imagen
        width: 1200,
        height: 630,
        alt: 'LaHaus AI - Asistente IA para Inmobiliarias',
      }
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaHaus AI',
    description: 'Asistente IA que responde en segundos y agenda más citas automáticamente.',
    images: ['/og-image.png'], // Misma imagen que OG
    creator: '@lahausai', // Cambia esto a tu handle de Twitter
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico'
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://lahaus.ai',
    languages: {
      'es': 'https://lahaus.ai/es',
      'en': 'https://lahaus.ai/en'
    }
  }
}

// Metadata específica para inglés
export const enMetadata: Metadata = {
  ...baseMetadata,
  title: {
    default: 'LaHaus AI',
    template: '%s | LaHaus AI'
  },
  description: 'AI Assistant that answers instantly and books more showings. Developers, realtors and teams have increased their sales up to 35%',
  keywords: [
    'real estate AI',
    'real estate virtual assistant',
    'real estate chatbot',
    'real estate automation',
    'LaHaus AI',
    'AI for realtors',
    'automatic scheduling',
    'lead qualification',
    'real estate technology'
  ],
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'LaHaus AI',
    description: 'AI Assistant that answers instantly and books more showings. Increase your sales up to 35%',
    locale: 'en_US',
    images: [
      {
        url: '/og-image-en.png',
        width: 1200,
        height: 630,
        alt: 'LaHaus AI - AI Assistant for Real Estate',
      }
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    title: 'LaHaus AI',
    description: 'AI Assistant that answers instantly and books more showings',
  },
}