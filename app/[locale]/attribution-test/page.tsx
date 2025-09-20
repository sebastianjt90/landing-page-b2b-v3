import { AttributionTestContent } from './attribution-test-content'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function AttributionTestPage({ params }: PageProps) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-gray-50">
      <AttributionTestContent locale={locale} />
    </div>
  )
}

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'en' }]
}