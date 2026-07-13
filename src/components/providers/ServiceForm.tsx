// src/components/providers/ServiceForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from 'react-hot-toast'
import type { Database } from '@/lib/types/database'

type Service = Database['public']['Tables']['services']['Row']

export default function ServiceForm({
  service,
  onSuccess,
  onCancel,
}: {
  service?: Service | null
  onSuccess: () => void
  onCancel: () => void
}) {
  const supabase = createClient()
  const [title, setTitle] = useState(service?.title || '')
  const [description, setDescription] = useState(service?.description || '')
  const [price, setPrice] = useState(service?.price ? String(service.price) : '')
  const [categoryId, setCategoryId] = useState(service?.category_id || '')
  const [duration, setDuration] = useState(service?.duration_minutes ? String(service.duration_minutes) : '')
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => setCategories(data || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !price || !categoryId) return toast.error('Veuillez remplir les champs obligatoires.')
    setLoading(true)

    const payload = {
      title,
      description,
      price: parseFloat(price),
      category_id: categoryId,
      duration_minutes: duration ? parseInt(duration) : null,
      price_unit: 'FCFA',
    }

    let error = null
    if (service) {
      const { error: err } = await supabase.from('services').update(payload).eq('id', service.id)
      error = err
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { error: err } = await supabase.from('services').insert({
        ...payload,
        provider_id: user.id,
        active: true,
      })
      error = err
    }

    if (error) {
      toast.error('Erreur lors de l’enregistrement.')
    } else {
      toast.success(service ? 'Service mis à jour.' : 'Service créé.')
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/80 space-y-5">
      <h3 className="text-xl font-semibold text-gray-800">
        {service ? 'Modifier le service' : 'Nouveau service'}
      </h3>
      <Input label="Titre *" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Description</label>
        <textarea
          className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Prix (FCFA) *" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <Input label="Durée (min)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Catégorie *</label>
        <select
          className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-700 outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Sélectionnez une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={loading}>Enregistrer</Button>
        <Button variant="ghost" type="button" onClick={onCancel}>Annuler</Button>
      </div>
    </form>
  )
}