'use client'

import { Button } from '@/components/ui/button'
import { translations } from '@/lib/translations'

interface CallToActionProps {
    locale: 'es' | 'en'
    onBookDemo?: () => void
}

export default function CallToAction({ locale, onBookDemo }: CallToActionProps) {
    const t = translations[locale]
    return (
        <section className="py-16 md:py-32 dark:bg-background" style={{ backgroundColor: '#00251D' }}>
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl" style={{ fontFamily: "'LaHaus Display', system-ui, sans-serif", fontWeight: 600, color: 'white' }}>
                        <span style={{ color: '#E19BFF' }}>{t.cta.title1}</span>{t.cta.title2}
                    </h2>
                    <p className="mt-4 text-lg" style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif", color: 'white' }}>
                        {t.cta.subtitle}
                    </p>

                    <div className="mt-12 flex flex-wrap justify-center">
                        <Button
                            size="lg"
                            className="bg-white hover:bg-white/90 text-[#00251D] shadow-none"
                            style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}
                            onClick={onBookDemo}>
                            <span>{t.cta.button}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}