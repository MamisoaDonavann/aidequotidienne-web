// src/app/page.tsx
import Link from 'next/link'
import { createServerClientFromCookies } from '@/lib/supabase/server'
import PrestataireCard from '@/components/providers/PrestataireCard'
import { HiSearch, HiStar, HiShieldCheck } from 'react-icons/hi'

// Composant serveur : récupère les prestataires vedettes
export default async function HomePage() {
  const supabase = createServerClientFromCookies()
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

  return (
    <>
      {/* Hero avec animation */}
      <section className="bg-hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight animate-fade-in">
            Des services fiables, <br />
            <span className="text-accent-500">à Madagascar</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Plomberie, nettoyage, jardinage… Trouvez le prestataire qu’il vous faut en quelques clics.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/recherche" className="btn-primary bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold shadow-2xl">
              <HiSearch className="inline mr-2" />
              Trouver un prestataire
            </Link>
            <Link href="/auth/signup?role=provider" className="btn-primary bg-accent-500 hover:bg-accent-600 px-8 py-3 rounded-full font-semibold">
              Devenir prestataire
            </Link>
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-800">Pourquoi AideQuotidienne ?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: <HiShieldCheck className="w-8 h-8 text-accent-500" />, title: 'Prestataires vérifiés', desc: 'Profils validés et évalués par la communauté.' },
              { icon: <HiSearch className="w-8 h-8 text-accent-500" />, title: 'Recherche facile', desc: 'Filtrez par catégorie et ville pour trouver le bon artisan.' },
              { icon: <HiStar className="w-8 h-8 text-accent-500" />, title: 'Avis transparents', desc: 'Lisez les retours d’expérience des clients avant de réserver.' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-100 text-accent-600 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-500 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catégories populaires */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary-800">Catégories populaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/recherche?categorie=${cat.slug}`}
                className="group bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition text-center"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform block mb-2">{cat.icon}</span>
                <span className="font-medium text-gray-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Prestataires en vedette */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-800 mb-10 text-center">Prestataires recommandés</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers?.map((provider) => (
              <PrestataireCard key={provider.id} provider={provider} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/recherche" className="btn-primary">Voir tous les prestataires</Link>
          </div>
        </div>
      </section>
    </>
  )
}