'use client'

import Image from 'next/image'
import Link from 'next/link'

export function WhatsAppButton() {
    return (
        <Link
            href="https://wa.me/521234567890?text=Hola%2C%20me%20gustar%C3%ADa%20conocer%20m%C3%A1s%20sobre%20el%20asistente%20IA%20para%20inmobiliarias"
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