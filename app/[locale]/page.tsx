import { HeroSection } from '@/components/hero-section'

export default function Page({ params }: { params: { locale: string } }) {
  return <HeroSection locale={params.locale} />
}