'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { Header } from '@/components/header'
import StatsSection from '@/components/stats'
import FeaturesSection from '@/components/features-5'
import IntegrationsSection from '@/components/integrations-7'
import CallToAction from '@/components/call-to-action'
import FAQsTwo from '@/components/faqs-2'
import { WhatsAppButton } from '@/components/whatsapp-button'
import FooterSection from '@/components/footer'
import { BookingModal } from '@/components/booking-modal'
import { translations } from '@/lib/translations'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection({ locale = 'es' }: { locale?: string }) {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
    const t = translations[locale as keyof typeof translations] || translations.es

    return (
        <>
            <Header onBookDemo={() => setIsBookingModalOpen(true)} locale={locale} />
            <WhatsAppButton locale={locale} />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section style={{ backgroundColor: '#F2F4F8' }}>
                    <div className="relative pt-24 md:pt-36">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring' as const,
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="absolute inset-0 -z-20">
                            <Image
                                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                                alt="background"
                                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                                width="3276"
                                height="4095"
                            />
                        </AnimatedGroup>
                        <div
                            aria-hidden
                            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
                        />
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <h1 
                                    className="mx-auto mt-8 max-w-5xl text-balance text-4xl font-semibold sm:text-5xl md:text-6xl lg:mt-16 xl:text-[4.5rem] px-4 sm:px-0"
                                    style={{ fontFamily: "'LaHaus Display', system-ui, sans-serif", fontWeight: 600 }}>
                                    <span style={{ color: '#E19BFF' }}>{t.hero.titleHighlight}</span>
                                    <span style={{ color: '#00251D' }}> {t.hero.titleMain}</span>
                                </h1>
                                <p className="mx-auto mt-8 max-w-2xl text-balance text-base sm:text-lg px-4 sm:px-0" 
                                    style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                                    {t.hero.subtitle.split('35%')[0]}<strong>35%</strong>{t.hero.subtitle.split('35%')[1]}
                                </p>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex justify-center">
                                    <div
                                        key={1}>
                                        <Button
                                            size="lg"
                                            className="rounded-xl px-5 text-base bg-[#00251D] hover:bg-[#00251D]/90 text-white shadow-none border-0"
                                            style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}
                                            onClick={() => setIsBookingModalOpen(true)}>
                                            <span className="text-nowrap">{t.hero.cta}</span>
                                        </Button>
                                    </div>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="relative mt-8 overflow-hidden px-6 sm:mt-12 md:mt-20">
                                <div
                                    aria-hidden
                                    className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <Image
                                    className="relative mx-auto w-full max-w-7xl"
                                    src={t.hero.mainImage}
                                    alt={t.hero.mainImageAlt}
                                    width="2544"
                                    height="1648"
                                    style={{ aspectRatio: '2544/1648' }}
                                    priority
                                />
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                <StatsSection locale={locale} />
                <FeaturesSection locale={locale} />
                <IntegrationsSection locale={locale} />
                <CallToAction onBookDemo={() => setIsBookingModalOpen(true)} locale={locale} />
                <FAQsTwo locale={locale} />
                <FooterSection locale={locale} />
            </main>
            
            {/* Booking Modal */}
            <BookingModal 
                isOpen={isBookingModalOpen} 
                onClose={() => setIsBookingModalOpen(false)} 
            />
        </>
    )
}