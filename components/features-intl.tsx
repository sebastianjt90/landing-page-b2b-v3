import { MessageSquare, Brain, Calendar, BarChart3, Phone } from 'lucide-react'
import Image from 'next/image'

export default function FeaturesSection() {
    return (
        <section className="py-16 md:py-32 bg-white">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
                    <div className="lg:col-span-2">
                        <div className="md:pr-6 lg:pr-0">
                            <h2 className="text-4xl font-semibold lg:text-5xl" style={{ fontFamily: "'LaHaus Display', system-ui, sans-serif", fontWeight: 600 }}>
                                Tu vendedor estrella que nunca descansa
                            </h2>
                            <p className="mt-6" style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                                Mientras tu equipo se enfoca en cerrar ventas, el asistente IA califica y nutre cada lead automáticamente.
                            </p>
                        </div>
                        <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
                            <li style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                                <Brain className="size-5" style={{ color: '#E19BFF' }} />
                                IA entrenada en el sector inmobiliario
                            </li>
                            <li style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                                <MessageSquare className="size-5" style={{ color: '#E19BFF' }} />
                                Respuesta inmediata 24/7
                            </li>
                            <li style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                                <Calendar className="size-5" style={{ color: '#E19BFF' }} />
                                Agendamiento y confirmación automática
                            </li>
                            <li style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                                <Phone className="size-5" style={{ color: '#E19BFF' }} />
                                Responde por chat y llamadas por voz con IA
                            </li>
                            <li style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif" }}>
                                <BarChart3 className="size-5" style={{ color: '#E19BFF' }} />
                                Analytics y reportes detallados
                            </li>
                        </ul>
                    </div>
                    <div className="relative lg:col-span-3 flex items-center justify-center">
                        <div className="max-w-md">
                            <Image 
                                src="/chat.gif" 
                                className="w-full h-auto" 
                                alt="LaHaus AI Chat Demo" 
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