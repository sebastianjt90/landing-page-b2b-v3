import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'

export default function LogoCloud() {
    const logos = [
        { src: '/logos/vsl/sadasi_logo.png', alt: 'Sadasi Logo' },
        { src: '/logos/vsl/logo-m2.png', alt: 'M2 Logo' },
        { src: '/logos/vsl/ingeurbe_logo.png', alt: 'Ingeurbe Logo' },
        { src: '/logos/vsl/capital_logo.png', alt: 'Capital Logo' },
        { src: '/logos/vsl/arqyconcreto_logo.png', alt: 'Arq y Concreto Logo' },
        { src: '/logos/vsl/vertice_logo.png', alt: 'Vértice Logo' },
        { src: '/logos/vsl/sisol_logo.png', alt: 'Sisol Logo' },
        { src: '/logos/vsl/sancarlos_logo.png', alt: 'San Carlos Logo' }
    ]

    return (
        <section className="logo-cloud-section" style={{ backgroundColor: '#FFFFFF', overflow: 'hidden', paddingTop: '48px', paddingBottom: '48px' }}>
            <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                <div className="logo-cloud-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
                    {/* Text section */}
                    <div className="logo-cloud-text" style={{ width: '100%', textAlign: 'center', flexShrink: 0 }}>
                        <p style={{ 
                            fontFamily: "'LaHaus Display', system-ui, sans-serif",
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: '#00251D',
                            lineHeight: '1.4',
                            margin: 0
                        }}>
                            Empresas líderes
                            <br />
                            confían en nosotros
                        </p>
                    </div>

                    {/* Logos slider section */}
                    <div className="logo-cloud-slider" style={{ position: 'relative', width: '100%', paddingTop: '32px', paddingBottom: '32px' }}>
                        <InfiniteSlider
                            speedOnHover={20}
                            speed={40}
                            gap={120}>
                            {logos.map((logo, index) => (
                                <div 
                                    key={index} 
                                    className="flex items-center justify-center"
                                    style={{ height: '64px' }}
                                >
                                    <img
                                        className="logo-image opacity-80 transition-opacity hover:opacity-100"
                                        style={{
                                            height: '48px',
                                            width: 'auto',
                                            maxWidth: '150px',
                                            objectFit: 'contain'
                                        }}
                                        src={logo.src}
                                        alt={logo.alt}
                                        width={200}
                                        height={64}
                                    />
                                </div>
                            ))}
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
            
            {/* Media queries para desktop */}
            <style jsx>{`
                .logo-cloud-section {
                    padding-top: 48px;
                    padding-bottom: 48px;
                }
                
                .logo-cloud-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 32px;
                }
                
                .logo-cloud-text {
                    width: 100%;
                    text-align: center;
                }
                
                .logo-cloud-slider {
                    width: 100%;
                    flex: 1;
                }
                
                .logo-image {
                    height: 48px !important;
                    max-width: 150px !important;
                }
                
                @media (min-width: 768px) {
                    .logo-cloud-section {
                        padding-top: 64px;
                        padding-bottom: 64px;
                    }
                    
                    .logo-cloud-container {
                        flex-direction: row !important;
                        gap: 48px !important;
                    }
                    
                    .logo-cloud-text {
                        width: auto !important;
                        max-width: 320px !important;
                        text-align: right !important;
                        border-right: 1px solid rgba(0, 37, 29, 0.2) !important;
                        padding-right: 32px !important;
                    }
                    
                    .logo-cloud-slider {
                        flex: 1 !important;
                    }
                    
                    .logo-image {
                        height: 56px !important;
                        max-width: 180px !important;
                    }
                }
                
                @media (min-width: 1024px) {
                    .logo-image {
                        height: 64px !important;
                        max-width: 200px !important;
                    }
                }
            `}</style>
        </section>
    )
}