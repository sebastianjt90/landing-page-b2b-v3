import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { translations } from '@/lib/translations'
import { Header } from '@/components/header'

type Props = {
  params: Promise<{ locale: 'es' | 'en' }>
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params
  const t = translations[locale].pricing

  return (
    <>
      <Header locale={locale} />
      <section className="py-16 md:py-32 bg-gradient-to-br from-primary-50 to-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <h1 className="text-center text-4xl font-semibold lg:text-5xl">{t.title}</h1>
            <p className="text-lg text-muted-foreground">{t.subtitle}</p>
          </div>

          <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
            {/* Starter Plan */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-medium">{t.plans.starter.name}</CardTitle>
                <span className="my-3 block">
                  <span className="text-3xl font-bold">{t.plans.starter.price}</span>
                  <span className="text-muted-foreground">{t.plans.starter.period}</span>
                </span>
                <CardDescription className="text-sm">{t.plans.starter.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {t.plans.starter.features.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2">
                      <Check className="size-4 mt-0.5 text-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto">
                <Button
                  asChild
                  variant="outline"
                  className="w-full">
                  <Link href={`/${locale}/signup`}>{t.getStarted}</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Professional Plan */}
            <Card className="relative border-primary shadow-lg">
              <span className="bg-gradient-to-r absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-primary to-primary-600 px-3 py-1 text-xs font-medium text-white">
                {t.popular}
              </span>

              <div className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-medium">{t.plans.professional.name}</CardTitle>
                  <span className="my-3 block">
                    <span className="text-3xl font-bold">{t.plans.professional.price}</span>
                    <span className="text-muted-foreground">{t.plans.professional.period}</span>
                  </span>
                  <CardDescription className="text-sm">{t.plans.professional.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <hr className="border-dashed" />
                  <ul className="list-outside space-y-3 text-sm">
                    {t.plans.professional.features.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2">
                        <Check className="size-4 mt-0.5 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    asChild
                    className="w-full">
                    <Link href={`/${locale}/signup`}>{t.getStarted}</Link>
                  </Button>
                </CardFooter>
              </div>
            </Card>

            {/* Enterprise Plan */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-medium">{t.plans.enterprise.name}</CardTitle>
                <span className="my-3 block">
                  <span className="text-3xl font-bold">{t.plans.enterprise.price}</span>
                </span>
                <CardDescription className="text-sm">{t.plans.enterprise.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {t.plans.enterprise.features.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2">
                      <Check className="size-4 mt-0.5 text-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto">
                <Button
                  asChild
                  variant="outline"
                  className="w-full">
                  <Link href={`https://wa.me/525530212543?text=${encodeURIComponent(locale === 'es' ? 'Hola, me interesa el plan Enterprise de LaHaus AI' : 'Hi, I\'m interested in the LaHaus AI Enterprise plan')}`}>
                    {t.contactSales}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}