import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'

export default function LogoCloud() {
    return (
        <section className="bg-background overflow-hidden py-16">
            <div className="group relative m-auto max-w-7xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="md:max-w-44 md:border-r md:pr-6">
                        <p className="text-end text-sm">Empresas líderes confían en nosotros</p>
                    </div>
                    <div className="relative py-6 md:w-[calc(100%-11rem)]">
                        <InfiniteSlider
                            speedOnHover={20}
                            speed={40}
                            gap={112}>
                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/vsl/sadasi_logo.png"
                                    alt="Sadasi Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/vsl/logo-m2.png"
                                    alt="M2 Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/vsl/ingeurbe_logo.png"
                                    alt="Ingeurbe Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/vsl/capital_logo.png"
                                    alt="Capital Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/vsl/arqyconcreto_logo.png"
                                    alt="Arq y Concreto Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/vsl/vertice_logo.png"
                                    alt="Vértice Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/vsl/sisol_logo.png"
                                    alt="Sisol Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/vsl/sancarlos_logo.png"
                                    alt="San Carlos Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>
                        </InfiniteSlider>

                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-20"
                            direction="left"
                            blurIntensity={1}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-20"
                            direction="right"
                            blurIntensity={1}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
