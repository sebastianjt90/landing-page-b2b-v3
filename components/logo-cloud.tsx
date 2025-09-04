import { InfiniteSlider } from '@/components/ui/infinite-slider'

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
                                    src="/logos/amarilo.svg"
                                    alt="Amarilo Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/vivienda.svg"
                                    alt="Constructora Vivienda Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/oikos.svg"
                                    alt="Oikos Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/prodesa.svg"
                                    alt="Prodesa Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/apiros.png"
                                    alt="Apiros Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/bolivar.svg"
                                    alt="Constructora Bolivar Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/colpatria.svg"
                                    alt="Constructora Colpatria Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit"
                                    src="/logos/metroc.svg"
                                    alt="Constructora Metroc Logo"
                                    height="32"
                                    width="auto"
                                />
                            </div>
                        </InfiniteSlider>

                        <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                        <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}
