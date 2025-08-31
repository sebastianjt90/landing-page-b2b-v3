import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to locale-specific page
  // The middleware will handle the actual locale detection
  redirect('/es')
}