import { Button } from '@/components/ui/button'

export default function ContentSection({ onBookDemo }: { onBookDemo?: () => void }) {
    return (
        <section style={{ paddingTop: '80px', paddingBottom: '32px' }}>
            <div style={{ 
                maxWidth: '900px', 
                margin: '0 auto', 
                padding: '0 24px'
            }}>
                <div style={{ 
                    maxWidth: '850px', 
                    margin: '0 auto',
                    textAlign: 'center',
                    marginBottom: '48px'
                }}>
                    <h1 style={{ 
                        fontFamily: "'LaHaus Display', system-ui, sans-serif", 
                        fontWeight: 700, 
                        color: '#00251D',
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        lineHeight: '1.1',
                        marginBottom: '24px'
                    }}>
                        Aumentaremos tus ventas un <span style={{ color: '#E19BFF' }}>35%</span> en los próximos 3 meses
                    </h1>
                    <p style={{ 
                        color: '#00251D', 
                        fontFamily: "'Wix Madefor Text', system-ui, sans-serif",
                        fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                        lineHeight: '1.6',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Conoce el asistente IA para desarrolladores e inmobiliarias que está transformando el mercado inmobiliario
                    </p>
                </div>
                <div style={{ 
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '56.25%',
                    height: 0,
                    overflow: 'hidden',
                    borderRadius: '8px',
                    backgroundColor: '#000',
                    marginBottom: '48px'
                }}>
                    <iframe 
                        id="panda-1aca3b0c-7f26-41eb-9834-1e015b55a908" 
                        src="https://player-vz-711edda5-617.tv.pandavideo.com/embed/?v=1aca3b0c-7f26-41eb-9834-1e015b55a908" 
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            zIndex: 1
                        }}
                        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen" 
                        allowFullScreen={true}
                        loading="lazy"
                        title="Video LaHaus AI"
                    />
                </div>
                
                {/* CTA Button */}
                <div style={{ textAlign: 'center' }}>
                    <Button
                        size="lg"
                        style={{ 
                            fontFamily: "'LaHaus Display', system-ui, sans-serif",
                            backgroundColor: '#00251D',
                            color: 'white',
                            padding: '28px 48px',
                            fontSize: '20px',
                            fontWeight: '600',
                            borderRadius: '16px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px 0 rgba(0, 37, 29, 0.25)',
                            transition: 'all 0.3s ease',
                            transform: 'scale(1)',
                            letterSpacing: '0.02em'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(0, 37, 29, 0.35)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0, 37, 29, 0.25)';
                        }}
                        onClick={onBookDemo}>
                        <span style={{ whiteSpace: 'nowrap' }}>Agenda tu demo ahora</span>
                    </Button>
                </div>
            </div>
        </section>
    )
}
