import { HeroSection } from '@/components/hero-section'

export default function Page({ params }: { params: { locale: string } }) {
  // Por ahora usamos el hero-section original
  // TODO: Implementar versión internacionalizada completa
  return <HeroSection />
}