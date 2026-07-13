// src/components/booking/BookingRequestForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from 'react-hot-toast'
import { HiCalendar, HiClock, HiLocationMarker, HiPhone } from 'react-icons/hi'

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
      console.error(error)
    } else {
      toast.success('Réservation envoyée avec succès !')
      setShowForm(false)
      // Réinitialiser les champs
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
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl border space-y-3 mt-4 md:mt-0">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Précisez votre besoin..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" isLoading={loading} className="flex-1">
              Confirmer la demande
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