'use client'

import Image from 'next/image'
import Link from 'next/link'
import { translations } from '@/lib/translations'

interface WhatsAppButtonProps {
    locale: 'es' | 'en'
}

export function WhatsAppButton({ locale }: WhatsAppButtonProps) {
    const t = translations[locale]
    
    const phoneNumber = t.whatsapp.phoneNumber
    const message = t.whatsapp.message
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    return (
        <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
            aria-label="Chat on WhatsApp">
            <Image 
                src="/whatsapp.svg" 
                alt="WhatsApp" 
                width={32} 
                height={32}
                className="fill-white"
            />
        </Link>
    )
}