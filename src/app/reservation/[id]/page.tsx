// src/app/reservation/[id]/page.tsx
import { createServerClientFromCookies } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BookingStatusBadge from '@/components/booking/BookingStatusBadge'
import Link from 'next/link'
import { HiCalendar, HiLocationMarker } from 'react-icons/hi'

export default async function ReservationDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClientFromCookies() // ← await

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, client:client_id(full_name), provider:provider_id(full_name), service:service_id(title)')
    .eq('id', params.id)
    .single()

  if (!booking) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary-800 mb-6">Détail de la réservation</h1>
      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{booking.service?.title || 'Service'}</h2>
          <BookingStatusBadge status={booking.status} />
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Client</p>
            <p className="font-medium">{booking.client?.full_name}</p>
          </div>
          <div>
            <p className="text-gray-500">Prestataire</p>
            <p className="font-medium">{booking.provider?.full_name}</p>
          </div>
          <div className="flex items-center gap-1">
            <HiCalendar className="w-4 h-4 text-gray-400" />
            <span>{new Date(booking.scheduled_date).toLocaleDateString('fr-FR', { dateStyle: 'full' })}</span>
          </div>
          {booking.scheduled_time && <div>{booking.scheduled_time.slice(0, 5)}</div>}
          {booking.address && (
            <div className="flex items-center gap-1">
              <HiLocationMarker className="w-4 h-4 text-gray-400" />
              <span>{booking.address}</span>
            </div>
          )}
        </div>
        {booking.notes && (
          <div>
            <p className="text-gray-500 text-sm">Notes</p>
            <p>{booking.notes}</p>
          </div>
        )}
        <div className="flex gap-3 mt-4">
          <Link href={`/messages/${booking.id}`} className="btn-primary">Envoyer un message</Link>
        </div>
      </div>
    </div>
  )
}