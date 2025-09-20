import { UTMTestContent } from './utm-test-content'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function UTMTestIframePage({ params }: PageProps) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <UTMTestContent locale={locale} />
    </div>
  )
}

