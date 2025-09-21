'use client'

import { useState } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ContentSection from '@/components/content-5'
import LogoCloud from '@/components/logo-cloud'
import { Logo } from '@/components/logo'
import { VSLPmaxBookingModal } from '@/components/vsl-pmax-booking-modal'
import { use } from 'react'

type Props = {
  params: Promise<{ locale: string }>
}

export default function VSLPmaxPage({ params }: Props) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const { locale } = use(params)

  // Si no es español, redirigir a español
  if (locale !== 'es') {
    redirect('/es/vsl-pmax')
  }

  return (
    <div style={{ fontFamily: "'LaHaus', system-ui, sans-serif", backgroundColor: 'white', minHeight: '100vh' }}>
      {/* Header con Logo */}
      <header style={{
        position: 'fixed',
        top: '24px',
        left: '32px',
        zIndex: 50
      }}>
        <Link href={`/${locale}`} style={{ display: 'inline-block' }}>
          <Logo className="h-5 md:h-6 w-auto" />
        </Link>
      </header>

      <ContentSection onBookDemo={() => setIsBookingModalOpen(true)} />
      <LogoCloud />

      {/* VSL Pmax Booking Modal */}
      <VSLPmaxBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  )
}