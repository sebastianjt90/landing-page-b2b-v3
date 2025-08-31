'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function FAQsTwo() {
    const faqItems = [
        {
            id: 'item-1',
            question: '¿Cuánto tiempo toma implementar el asistente IA?',
            answer: 'La implementación toma 7 días hábiles y se hace en 3 pasos simples: primero se crea la identidad del agente con el nombre y la identidad de tu marca, luego se alimenta su base de conocimiento con la información de tus proyectos, y finalmente se integra con tu CRM y calendarios.',
        },
        {
            id: 'item-2',
            question: '¿En qué canales puede atender el asistente?',
            answer: 'En todos los canales de generación de demanda: campañas de Facebook, Instagram, Google que lleguen a tu sitio web, WhatsApp, Messenger y cualquier canal que prefieras. El asistente está donde están tus clientes.',
        },
        {
            id: 'item-3',
            question: '¿Puedo personalizar el nombre y marca del agente?',
            answer: 'Sí, puedes personalizar completamente el nombre de tu agente como quieras y con tu marca. El asistente se adapta totalmente a tu identidad corporativa, usando tus colores, tono de comunicación y personalidad de marca.',
        },
        {
            id: 'item-4',
            question: '¿El agente puede recomendar varios proyectos al mismo tiempo?',
            answer: 'Sí, está diseñado para gestionar y recomendar todos los proyectos que quieras. Puede realizar ventas cruzadas inteligentes y conectar a los clientes con proyectos nuevos basándose en sus preferencias y necesidades.',
        },
        {
            id: 'item-5',
            question: '¿Puedo ver las conversaciones del asistente?',
            answer: 'En nuestro dashboard de LaHaus AI tienes acceso completo a todas las conversaciones, tasas de conversión, analítica detallada y segmentación de clientes que te permitirán tomar mejores decisiones en tu día a día.',
        },
        {
            id: 'item-6',
            question: '¿El agente IA reemplaza a mi equipo de ventas?',
            answer: 'No, el agente potencia a tu equipo. Permite que tus vendedores se enfoquen en lo que saben hacer mejor: atender clientes listos para comprar. El agente se encarga de calificar leads y enviar clientes con citas agendadas de calidad.',
        },
    ]

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl" style={{ fontFamily: "'LaHaus Display', system-ui, sans-serif", fontWeight: 600 }}>
                        Preguntas Frecuentes
                    </h2>
                    <p className="mt-4 text-balance" style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif", color: '#00251D' }}>
                        Encuentra respuestas rápidas y completas a las preguntas más comunes sobre nuestro asistente IA.
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