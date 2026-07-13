// src/app/page.tsx
import Link from 'next/link'
import { createServerClientFromCookies } from '@/lib/supabase/server'
import PrestataireCard from '@/components/providers/PrestataireCard'
import { HiSearch, HiStar, HiShieldCheck } from 'react-icons/hi'

export default async function HomePage() {
  const supabase = await createServerClientFromCookies() // ← await ajouté
  const { data: providers } = await supabase
    .from('profiles')
    .select('*, services(count)')
    .eq('role', 'provider')
    .limit(6)

  const categories = [
    { name: 'Plomberie', slug: 'plomberie', icon: '🔧' },
    { name: 'Nettoyage', slug: 'nettoyage', icon: '🧹' },
    { name: 'Électricité', slug: 'reparation-electrique', icon: '💡' },
    { name: 'Jardinage', slug: 'jardinage', icon: '🌿' },
    { name: 'Peinture', slug: 'peinture', icon: '🎨' },
    { name: 'Déménagement', slug: 'demenagement', icon: '🚚' },
  ]

  // ... (le reste du JSX est inchangé)
  return (
    <>
      <section className="bg-hero-gradient text-white">
        {/* ... */}
      </section>
      {/* ... */}
    </>
  )
}