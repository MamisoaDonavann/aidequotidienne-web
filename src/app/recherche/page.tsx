'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PrestataireCard from '@/components/providers/PrestataireCard'
import { HiSearch, HiX } from 'react-icons/hi'
import Input from '@/components/ui/Input'

const supabase = createClient()

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [providers, setProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(searchParams.get('categorie') || '')
  const [location, setLocation] = useState('')

  const categories = [
    { slug: 'plomberie', name: 'Plomberie' },
    { slug: 'nettoyage', name: 'Nettoyage' },
    { slug: 'reparation-electrique', name: 'Électricité' },
    { slug: 'jardinage', name: 'Jardinage' },
    { slug: 'peinture', name: 'Peinture' },
    { slug: 'demenagement', name: 'Déménagement' },
  ]

  const locations = ['Antananarivo', 'Toamasina', 'Antsirabe', 'Fianarantsoa', 'Mahajanga']

  const fetchProviders = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('profiles').select('*, services(count)').eq('role', 'provider')

    if (location) query = query.eq('location', location)
    if (search) query = query.ilike('full_name', `%${search}%`)

    if (category) {
      const { data: services } = await supabase
        .from('services')
        .select('provider_id, categories!inner(slug)')
        .eq('categories.slug', category)
      const providerIds = [...new Set(services?.map((s) => s.provider_id))]
      if (providerIds.length > 0) query = query.in('id', providerIds)
      else query = query.limit(0)
    }

    const { data, error } = await query.limit(20)
    if (!error) setProviders(data || [])
    setLoading(false)
  }, [category, location, search])

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  useEffect(() => {
    const params = new URLSearchParams()
    if (category) params.set('categorie', category)
    router.replace(`/recherche?${params.toString()}`, { scroll: false })
  }, [category])

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setLocation('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Rechercher un prestataire</h1>
      <p className="text-gray-500 mb-8">Filtrez par catégorie et ville pour trouver l'artisan idéal.</p>

      {/* Filtres */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-white/80 mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <Input
              label="Recherche par nom"
              placeholder="Nom du prestataire"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<HiSearch className="w-5 h-5" />}
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-700 outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition"
            >
              <option value="">Toutes</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Ville</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-700 outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition"
            >
              <option value="">Toutes</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <button
            onClick={clearFilters}
            className="text-primary-600 hover:text-primary-800 font-medium text-sm flex items-center gap-1 pb-1"
          >
            <HiX size={16} />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Résultats */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/80 rounded-2xl h-40 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <HiSearch className="mx-auto h-12 w-12 mb-4" />
          <p className="text-xl">Aucun prestataire trouvé</p>
          <p className="mt-2">Modifiez vos filtres et réessayez.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <PrestataireCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  )
}