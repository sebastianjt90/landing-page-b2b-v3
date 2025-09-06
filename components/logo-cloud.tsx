import { InfiniteSlider } from '@/components/ui/infinite-slider'
import Image from 'next/image'

export default function LogoCloud() {
    const logos = [
        // Logos VSL disponibles
        { src: '/logos/vsl/sadasi_logo.png', alt: 'Sadasi' },
        { src: '/logos/vsl/logo-m2.png', alt: 'M2' },
        { src: '/logos/vsl/ingeurbe_logo.png', alt: 'Ingeurbe' },
        { src: '/logos/vsl/capital_logo.png', alt: 'Capital' },
        { src: '/logos/vsl/arqyconcreto_logo.png', alt: 'Arq y Concreto' },
        { src: '/logos/vsl/vertice_logo.png', alt: 'Vértice' },
        { src: '/logos/vsl/sisol_logo.png', alt: 'Sisol' },
        { src: '/logos/vsl/sancarlos_logo.png', alt: 'San Carlos' },
    ]

    return (
        <section className="overflow-hidden bg-white py-16">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col items-center gap-8 px-6 md:flex-row md:gap-0">
                    {/* Texto a la izquierda */}
                    <div className="flex-shrink-0 text-center md:border-r md:border-gray-200 md:pr-6 md:text-right">
                        <p className="text-sm font-medium text-gray-600 md:whitespace-nowrap">
                            Empresas líderes<br className="md:hidden" />
                            confían en nosotros
                        </p>
                    </div>
                    
                    {/* Slider de logos */}
                    <div className="relative w-full overflow-hidden md:ml-6">
                        <InfiniteSlider
                            speedOnHover={20}
                            speed={40}
                            gap={80}
                            className="w-full">
                            {logos.map((logo, index) => (
                                <div key={index} className="flex items-center justify-center">
                                    <img
                                        src={logo.src}
                                        alt={logo.alt}
                                        className="h-8 w-auto object-contain"
                                        style={{ maxWidth: '120px' }}
                                    />
                                </div>
                            ))}
                        </InfiniteSlider>
                        
                        {/* Gradientes para fade effect */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent md:w-20" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent md:w-20" />
                    </div>
                </div>
            </div>
        </section>
    )
}
