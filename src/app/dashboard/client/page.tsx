// src/app/dashboard/client/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import BookingStatusBadge from '@/components/booking/BookingStatusBadge'
import { HiCalendar, HiUser } from 'react-icons/hi'
import Link from 'next/link'

export default function ClientDashboard() {
  const supabase = createClient()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('bookings')
        .select('*, provider:provider_id(full_name), service:service_id(title)')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      setBookings(data || [])
      setLoading(false)
    }
    fetchBookings()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary-800 mb-6">Mes réservations</h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 h-24 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <HiCalendar className="mx-auto h-12 w-12 mb-3" />
          <p className="text-xl">Aucune réservation pour l’instant</p>
          <p className="mt-2">Recherchez un prestataire et réservez un service.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:shadow-md transition"
            >
              <div className="flex-1">
                <p className="font-semibold text-lg">{b.service?.title || 'Service'}</p>
                <p className="flex items-center text-gray-500 text-sm mt-1">
                  <HiUser className="mr-1 w-4 h-4" />
                  Prestataire : {b.provider?.full_name}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  <HiCalendar className="inline mr-1 w-4 h-4" />
                  {new Date(b.scheduled_date).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                  })}
                  {b.scheduled_time && ` à ${b.scheduled_time.slice(0, 5)}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <BookingStatusBadge status={b.status} />
                <Link
                  href={`/messages/${b.id}`}
                  className="text-primary-600 hover:underline text-sm"
                >
                  Message
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}