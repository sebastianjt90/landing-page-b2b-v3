import { cn } from '@/lib/utils'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { Logo } from '@/components/logo'
import Image from 'next/image'
import { translations } from '@/lib/translations'

export default function IntegrationsSection({ locale = 'es' }: { locale?: string }) {
    const t = translations[locale as keyof typeof translations] || translations.es
    return (
        <section>
            <div className="dark:bg-background py-24 md:py-32" style={{ backgroundColor: '#F2F4F8' }}>
                <div className="mx-auto max-w-5xl px-6">
                    <div className="bg-muted/25 group relative mx-auto max-w-[22rem] items-center justify-between space-y-6 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] sm:max-w-md">
                        <div
                            role="presentation"
                            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] opacity-50"></div>
                        <div>
                            <InfiniteSlider
                                gap={24}
                                speed={20}
                                speedOnHover={10}>
                                <IntegrationCard name="Google Calendar">
                                    <Image src="/integrations/Google_Calendar_icon_(2020).svg.png" alt="Google Calendar" width={32} height={32} className="object-contain" />
                                </IntegrationCard>
                                <IntegrationCard name="Outlook Calendar">
                                    <Image src="/integrations/outlook calendar.png" alt="Outlook Calendar" width={26} height={26} className="object-contain" />
                                </IntegrationCard>
                                <IntegrationCard name="Google Sheets">
                                    <Image src="/integrations/sheets.png" alt="Google Sheets" width={26} height={26} className="object-contain" />
                                </IntegrationCard>
                            </InfiniteSlider>
                        </div>

                        <div>
                            <InfiniteSlider
                                gap={24}
                                speed={20}
                                speedOnHover={10}
                                reverse>
                                <IntegrationCard name="HubSpot">
                                    <Image src="/integrations/hubspot.png" alt="HubSpot" width={32} height={32} className="object-contain" />
                                </IntegrationCard>
                                <IntegrationCard name="Salesforce">
                                    <Image src="/integrations/salesforce.png" alt="Salesforce" width={32} height={32} className="object-contain" />
                                </IntegrationCard>
                                <IntegrationCard name="Pipedrive">
                                    <Image src="/integrations/Pipedrive-Logo.png" alt="Pipedrive" width={36} height={36} className="object-contain" />
                                </IntegrationCard>
                                <IntegrationCard name="Zoho">
                                    <Image src="/integrations/zoho-new.png" alt="Zoho" width={34} height={34} className="object-contain" />
                                </IntegrationCard>
                                <IntegrationCard name="Go High Level">
                                    <Image src="/integrations/highlevel-logo.png" alt="Go High Level" width={36} height={36} className="object-contain" />
                                </IntegrationCard>
                                <IntegrationCard name="SmartHome">
                                    <Image src="/integrations/smarthome.png" alt="SmartHome" width={32} height={32} className="object-contain" />
                                </IntegrationCard>
                                <IntegrationCard name="Follow Up Boss">
                                    <Image src="/fub.png" alt="Follow Up Boss" width={36} height={36} className="object-contain" />
                                </IntegrationCard>
                            </InfiniteSlider>
                        </div>
                        <div>
                            <InfiniteSlider
                                gap={24}
                                speed={20}
                                speedOnHover={10}>
                                <IntegrationCard name="Facebook">
                                    <Image src="/integrations/facebook.png" alt="Facebook" width={32} height={32} className="object-contain" />
                                </IntegrationCard>
                                <IntegrationCard name="Google Ads">
                                    <Image src="/integrations/Google_Ads_logo.svg.png" alt="Google Ads" width={28} height={28} className="object-contain" />
                                </IntegrationCard>
                                <IntegrationCard name="Instagram">
                                    <Image src="/integrations/instagram.png" alt="Instagram" width={32} height={32} className="object-contain" />
                                </IntegrationCard>
                                <IntegrationCard name="Messenger">
                                    <Image src="/integrations/messenger-new.png" alt="Messenger" width={32} height={32} className="object-contain" />
                                </IntegrationCard>
                                <IntegrationCard name="WhatsApp">
                                    <Image src="/whatsapp.svg" alt="WhatsApp" width={28} height={28} className="object-contain" />
                                </IntegrationCard>
                            </InfiniteSlider>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="shadow-black-950/10 size-24 bg-white/95 shadow-2xl backdrop-blur-md dark:bg-black/95 dark:border-white/10 dark:shadow-white/15 rounded-full border flex items-center justify-center overflow-hidden p-4">
                                <div className="w-full h-full flex items-center justify-center">
                                    <Logo />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto mt-12 max-w-lg space-y-6 text-center">
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl" style={{ fontFamily: "'LaHaus Display', system-ui, sans-serif", fontWeight: 600 }}>{t.integrations.title}</h2>
                        <p style={{ fontFamily: "'Wix Madefor Text', system-ui, sans-serif", color: '#00251D' }}>{t.integrations.subtitle}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

const IntegrationCard = ({ children, className, isCenter = false, name }: { children: React.ReactNode; className?: string; position?: 'left-top' | 'left-middle' | 'left-bottom' | 'right-top' | 'right-middle' | 'right-bottom'; isCenter?: boolean; name?: string }) => {
    return (
        <div className={cn('bg-background relative z-20 flex size-12 rounded-full border', className)} title={name}>
            <div className={cn('m-auto size-fit flex items-center justify-center', isCenter && '*:size-12')}>{children}</div>
        </div>
    )
}
