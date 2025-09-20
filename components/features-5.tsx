import { MessageSquare, Brain, Calendar, BarChart3, Phone } from 'lucide-react'
import Image from 'next/image'
import { translations } from '@/lib/translations'

export default function FeaturesSection({ locale = 'es' }: { locale?: string }) {
    const t = translations[locale as keyof typeof translations] || translations.es
    return (
        <section className="py-16 md:py-32 bg-white">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
                    <div className="lg:col-span-2">
                        <div className="md:pr-6 lg:pr-0">
                            <h2 className="text-4xl font-semibold lg:text-5xl" style={{ fontFamily: "'LaHaus Display', system-ui, sans-serif", fontWeight: 600 }}>
                                {t.features.title}
                            </h2>
                            <p className="mt-6" style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                                {t.features.subtitle}
                            </p>
                        </div>
                        <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
                            <li style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                                <Brain className="size-5" style={{ color: '#E19BFF' }} />
                                {t.features.items[0]}
                            </li>
                            <li style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                                <MessageSquare className="size-5" style={{ color: '#E19BFF' }} />
                                {t.features.items[1]}
                            </li>
                            <li style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                                <Calendar className="size-5" style={{ color: '#E19BFF' }} />
                                {t.features.items[2]}
                            </li>
                            <li style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                                <Phone className="size-5" style={{ color: '#E19BFF' }} />
                                {t.features.items[3]}
                            </li>
                            <li style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                                <BarChart3 className="size-5" style={{ color: '#E19BFF' }} />
                                {t.features.items[4]}
                            </li>
                        </ul>
                    </div>
                    <div className="relative lg:col-span-3 flex items-center justify-center">
                        <div className="max-w-md">
                            <Image 
                                src={t.features.chatGif} 
                                className="w-full h-auto" 
                                alt={t.features.chatGifAlt} 
                                width={400} 
                                height={800}
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}