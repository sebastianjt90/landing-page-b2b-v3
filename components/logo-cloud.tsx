import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'

export default function LogoCloud() {
    return (
        <section className="bg-background overflow-hidden py-12 md:py-16">
            <div className="group relative m-auto max-w-7xl px-6">
                <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
                    <div className="text-center md:max-w-xs md:border-r md:border-muted-foreground/20 md:pr-8 md:text-right">
                        <p style={{ 
                            fontFamily: "'LaHaus Display', system-ui, sans-serif",
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: '#00251D',
                            lineHeight: '1.4'
                        }}>
                            Empresas líderes
                            <br />
                            confían en nosotros
                        </p>
                    </div>
                    <div className="relative w-full py-8 md:w-[calc(100%-16rem)]">
                        <InfiniteSlider
                            speedOnHover={20}
                            speed={40}
                            gap={120}>
                            <div className="flex items-center">
                                <img
                                    className="mx-auto h-12 w-fit md:h-14 lg:h-16 opacity-80 hover:opacity-100 transition-opacity"
                                    src="/logos/vsl/sadasi_logo.png"
                                    alt="Sadasi Logo"
                                    height="64"
                                    width="auto"
                                />
                            </div>
                            <div className="flex items-center">
                                <img
                                    className="mx-auto h-12 w-fit md:h-14 lg:h-16 opacity-80 hover:opacity-100 transition-opacity"
                                    src="/logos/vsl/logo-m2.png"
                                    alt="M2 Logo"
                                    height="64"
                                    width="auto"
                                />
                            </div>
                            <div className="flex items-center">
                                <img
                                    className="mx-auto h-12 w-fit md:h-14 lg:h-16 opacity-80 hover:opacity-100 transition-opacity"
                                    src="/logos/vsl/ingeurbe_logo.png"
                                    alt="Ingeurbe Logo"
                                    height="64"
                                    width="auto"
                                />
                            </div>
                            <div className="flex items-center">
                                <img
                                    className="mx-auto h-12 w-fit md:h-14 lg:h-16 opacity-80 hover:opacity-100 transition-opacity"
                                    src="/logos/vsl/capital_logo.png"
                                    alt="Capital Logo"
                                    height="64"
                                    width="auto"
                                />
                            </div>
                            <div className="flex items-center">
                                <img
                                    className="mx-auto h-12 w-fit md:h-14 lg:h-16 opacity-80 hover:opacity-100 transition-opacity"
                                    src="/logos/vsl/arqyconcreto_logo.png"
                                    alt="Arq y Concreto Logo"
                                    height="64"
                                    width="auto"
                                />
                            </div>
                            <div className="flex items-center">
                                <img
                                    className="mx-auto h-12 w-fit md:h-14 lg:h-16 opacity-80 hover:opacity-100 transition-opacity"
                                    src="/logos/vsl/vertice_logo.png"
                                    alt="Vértice Logo"
                                    height="64"
                                    width="auto"
                                />
                            </div>
                            <div className="flex items-center">
                                <img
                                    className="mx-auto h-12 w-fit md:h-14 lg:h-16 opacity-80 hover:opacity-100 transition-opacity"
                                    src="/logos/vsl/sisol_logo.png"
                                    alt="Sisol Logo"
                                    height="64"
                                    width="auto"
                                />
                            </div>
                            <div className="flex items-center">
                                <img
                                    className="mx-auto h-12 w-fit md:h-14 lg:h-16 opacity-80 hover:opacity-100 transition-opacity"
                                    src="/logos/vsl/sancarlos_logo.png"
                                    alt="San Carlos Logo"
                                    height="64"
                                    width="auto"
                                />
                            </div>
                        </InfiniteSlider>

                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-24"
                            direction="left"
                            blurIntensity={0.8}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-24"
                            direction="right"
                            blurIntensity={0.8}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
