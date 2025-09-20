'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LanguageSelectorProps {
  locale: string
}

export function LanguageSelector({ locale }: LanguageSelectorProps) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLanguage = (newLocale: string) => {
    // Remove the current locale from the pathname and add the new one
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="gap-2 text-gray-700 hover:text-gray-900"
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium">{locale.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => switchLanguage('es')}
          className={locale === 'es' ? 'bg-gray-100' : ''}
        >
          <span className="mr-2">🇲🇽</span>
          Español
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLanguage('en')}
          className={locale === 'en' ? 'bg-gray-100' : ''}
        >
          <span className="mr-2">🇺🇸</span>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}