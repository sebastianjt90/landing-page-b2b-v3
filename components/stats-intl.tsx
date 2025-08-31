'use client'

import { useEffect, useRef, useState } from 'react'

interface StatProps {
    value: string
    label: string
    isNegative?: boolean
}

function AnimatedStat({ value, label, isNegative = false }: StatProps) {
    const [displayValue, setDisplayValue] = useState('0')
    const [hasAnimated, setHasAnimated] = useState(false)
    const statRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true)
                        animateValue()
                    }
                })
            },
            { threshold: 0.5 }
        )

        if (statRef.current) {
            observer.observe(statRef.current)
        }

        return () => {
            if (statRef.current) {
                observer.unobserve(statRef.current)
            }
        }
    }, [hasAnimated])

    const animateValue = () => {
        // Extract numeric value and suffix
        const match = value.match(/^([+-]?)(\d+(?:\.\d+)?)(.*)$/)
        if (!match) {
            setDisplayValue(value)
            return
        }

        const [, sign, numStr, suffix] = match
        const targetNum = parseFloat(numStr)
        const duration = 2000 // 2 seconds
        const steps = 60
        const stepDuration = duration / steps
        let current = 0

        const timer = setInterval(() => {
            current += targetNum / steps
            if (current >= targetNum) {
                current = targetNum
                clearInterval(timer)
            }
            
            // Format the display value
            let display = current.toFixed(suffix === 'x' ? 1 : 0)
            if (suffix === '%' && display === '100') {
                display = '98' // Keep it at 98% max
            }
            setDisplayValue(`${sign}${display}${suffix}`)
        }, stepDuration)
    }

    return (
        <div className="space-y-4" ref={statRef}>
            <div 
                className="text-5xl font-bold" 
                style={{ 
                    fontFamily: "'LaHaus Display', system-ui, sans-serif", 
                    color: '#6400B9' 
                }}>
                {displayValue}
            </div>
            <p style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                {label}
            </p>
        </div>
    )
}

export default function StatsSection() {
    return (
        <section className="py-12 md:py-20 bg-background">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-3xl space-y-6 text-center">
                    <h2 className="text-4xl font-medium lg:text-5xl" style={{ fontFamily: "'LaHaus Display', system-ui, sans-serif", fontWeight: 600 }}>
                        De perder oportunidades a cerrar más ventas
                    </h2>
                    <p style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                        Mira cómo desarrolladores e inmobiliarias como la tuya transformaron su proceso comercial
                    </p>
                </div>

                <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
                    <AnimatedStat value="24/7" label="Disponibilidad total" />
                    <AnimatedStat value="-65%" label="Menos tiempo de espera" isNegative />
                    <AnimatedStat value="3.5x" label="Más citas calificadas" />
                </div>

                <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0 mt-12">
                    <AnimatedStat value="+50K" label="Conversaciones exitosas" />
                    <AnimatedStat value="98%" label="Clientes satisfechos" />
                    <AnimatedStat value="+35%" label="Incremento final en ventas" />
                </div>
            </div>
        </section>
    )
}