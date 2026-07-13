// src/app/recherche/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PrestataireCard from '@/components/providers/PrestataireCard'
import Input from '@/components/ui/Input'
import { HiFilter, HiX } from 'react-icons/hi'

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

    // Filtre par catégorie (via jointure sur services)
    if (category) {
      const { data: services } = await supabase
        .from('services')
        .select('provider_id, categories!inner(slug)')
        .eq('categories.slug', category)
      const providerIds = [...new Set(services?.map((s) => s.provider_id))]
      if (providerIds.length > 0) query = query.in('id', providerIds)
      else query = query.limit(0) // aucun prestataire pour cette catégorie
    }

    const { data, error } = await query.limit(20)
    if (!error) setProviders(data || [])
    setLoading(false)
  }, [category, location, search])

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  // Mettre à jour l'URL avec les paramètres
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
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary-800 mb-6">Rechercher un prestataire</h1>

      {/* Filtres */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <Input
            label="Recherche par nom"
            placeholder="Nom du prestataire"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            >
              <option value="">Toutes catégories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field"
            >
              <option value="">Toute ville</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <button
            onClick={clearFilters}
            className="text-primary-600 hover:text-primary-800 font-medium text-sm flex items-center gap-1"
          >
            <HiX size={16} />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Résultats */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-40 animate-pulse" />
          ))}
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <HiFilter className="mx-auto h-12 w-12 mb-3" />
          <p className="text-xl">Aucun prestataire trouvé</p>
          <p className="mt-2">Modifiez vos filtres et réessayez.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <PrestataireCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  )
}