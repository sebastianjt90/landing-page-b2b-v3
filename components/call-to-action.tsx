'use client'

import { Button } from '@/components/ui/button'

interface CallToActionProps {
    onBookDemo?: () => void
}

export default function CallToAction({ onBookDemo }: CallToActionProps) {
    return (
        <section className="py-16 md:py-32 dark:bg-background" style={{ backgroundColor: '#00251D' }}>
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl" style={{ fontFamily: "'LaHaus Display', system-ui, sans-serif", fontWeight: 600, color: 'white' }}>
                        <span style={{ color: '#E19BFF' }}>Cada hora sin IA</span>, pierdes clientes potenciales
                    </h2>
                    <p className="mt-4 text-lg" style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif", color: 'white' }}>
                        Únete a las desarrolladoras e inmobiliarias que ya no dejan escapar ninguna oportunidad
                    </p>

                    <div className="mt-12 flex flex-wrap justify-center">
                        <Button
                            size="lg"
                            className="bg-white hover:bg-white/90 text-[#00251D] shadow-none"
                            style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}
                            onClick={onBookDemo}>
                            <span>Agenda un demo</span>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}