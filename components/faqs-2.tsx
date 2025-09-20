'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { translations } from '@/lib/translations'

export default function FAQsTwo({ locale = 'es' }: { locale?: string }) {
    const t = translations[locale as keyof typeof translations] || translations.es
    const faqItems = t.faqs.items.map((item, index) => ({
        id: `item-${index + 1}`,
        question: item.question,
        answer: item.answer,
    }))

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl" style={{ fontFamily: "'LaHaus Display', system-ui, sans-serif", fontWeight: 600 }}>
                        {t.faqs.title}
                    </h2>
                    <p className="mt-4 text-balance" style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif", color: '#00251D' }}>
                        {t.faqs.subtitle}
                    </p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dashed">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline" style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base" style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}