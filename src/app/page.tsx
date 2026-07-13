import Link from 'next/link'
import { createServerClientFromCookies } from '@/lib/supabase/server'
import PrestataireCard from '@/components/providers/PrestataireCard'
import { HiSearch, HiStar, HiShieldCheck } from 'react-icons/hi'

export default async function HomePage() {
  const supabase = await createServerClientFromCookies()
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
      {/* Hero premium avec dégradé animé */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600 text-white">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36 text-center">
          <h1 className="text-4xl md:text-7xl font-extrabold leading-tight tracking-tight animate-fade-in">
            Des services fiables, <br />
            <span className="text-accent-300">à Madagascar</span>
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Plomberie, nettoyage, jardinage… Trouvez le prestataire qu’il vous faut en quelques clics.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/recherche" className="inline-flex items-center bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold shadow-2xl shadow-black/20 transition hover:-translate-y-0.5">
              <HiSearch className="mr-2 h-5 w-5" />
              Trouver un prestataire
            </Link>
            <Link href="/auth/signup?role=provider" className="inline-flex items-center bg-accent-500 hover:bg-accent-600 px-8 py-4 rounded-2xl font-semibold shadow-2xl shadow-accent-500/20 transition hover:-translate-y-0.5">
              Devenir prestataire
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Avantages */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Pourquoi AideQuotidienne ?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-14">
            {[
              { icon: <HiShieldCheck className="w-8 h-8" />, title: 'Prestataires vérifiés', desc: 'Profils validés et évalués par la communauté.' },
              { icon: <HiSearch className="w-8 h-8" />, title: 'Recherche facile', desc: 'Filtrez par catégorie et ville pour trouver le bon artisan.' },
              { icon: <HiStar className="w-8 h-8" />, title: 'Avis transparents', desc: 'Lisez les retours d’expérience des clients avant de réserver.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white mb-6 shadow-lg shadow-primary-500/20">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-500 mt-3">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800">Catégories populaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/recherche?categorie=${cat.slug}`}
                className="group bg-gray-50 hover:bg-white rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform block mb-3">{cat.icon}</span>
                <span className="font-medium text-gray-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Prestataires en vedette */}
      <section className="py-20 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800">Prestataires recommandés</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {providers?.map((provider) => (
              <PrestataireCard key={provider.id} provider={provider} />
            ))}
          </div>
          <div className="text-center mt-14">
            <Link href="/recherche" className="btn-primary">Voir tous les prestataires</Link>
          </div>
        </div>
      </section>
    </>
  )
}