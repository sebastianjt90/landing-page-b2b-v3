import { HeroSection } from '@/components/hero-section'

export default async function Page({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params
  return <HeroSection locale={locale} />
}