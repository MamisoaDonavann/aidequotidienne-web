// src/components/booking/BookingRequestForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from 'react-hot-toast'
import { HiCalendar, HiClock, HiLocationMarker } from 'react-icons/hi'

export default function BookingRequestForm({ providerId }: { providerId: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Vous devez être connecté pour réserver.')
      router.push('/auth/login')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('bookings').insert({
      client_id: user.id,
      provider_id: providerId,
      status: 'pending',
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime || null,
      address: address || null,
      notes: notes || null,
    })

    if (error) {
      toast.error('Erreur lors de la réservation.')
    } else {
      toast.success('Réservation envoyée avec succès !')
      setShowForm(false)
      setScheduledDate('')
      setScheduledTime('')
      setAddress('')
      setNotes('')
    }
    setLoading(false)
  }

  return (
    <div>
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full md:w-auto">
          <HiCalendar className="mr-2" /> Réserver un service
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50/80 backdrop-blur-md rounded-2xl p-5 border border-white/60 space-y-4">
          <Input
            label="Date souhaitée"
            type="date"
            icon={<HiCalendar className="w-4 h-4" />}
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
          />
          <Input
            label="Heure (optionnel)"
            type="time"
            icon={<HiClock className="w-4 h-4" />}
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
          <Input
            label="Adresse"
            placeholder="Votre adresse"
            icon={<HiLocationMarker className="w-4 h-4" />}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Notes</label>
            <textarea
              className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition"
              rows={3}
              placeholder="Précisez votre besoin..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" isLoading={loading} className="flex-1">
              Confirmer
            </Button>
            <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}