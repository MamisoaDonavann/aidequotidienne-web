import { createServerClientFromCookies } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BookingStatusBadge from '@/components/booking/BookingStatusBadge'
import Link from 'next/link'
import { HiCalendar, HiLocationMarker } from 'react-icons/hi'

export default async function ReservationDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClientFromCookies()
  const { data: booking } = await supabase
    .from('bookings')
    .select('*, client:client_id(full_name), provider:provider_id(full_name), service:service_id(title)')
    .eq('id', params.id)
    .single()

  if (!booking) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Détail de la réservation</h1>
      <p className="text-gray-500 mb-8">Retrouvez toutes les informations de votre demande.</p>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/80">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{booking.service?.title || 'Service'}</h2>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-400 mb-1">Client</p>
            <p className="font-medium">{booking.client?.full_name}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Prestataire</p>
            <p className="font-medium">{booking.provider?.full_name}</p>
          </div>
          <div className="flex items-center gap-2">
            <HiCalendar className="w-4 h-4 text-gray-400" />
            <span>{new Date(booking.scheduled_date).toLocaleDateString('fr-FR', { dateStyle: 'full' })}</span>
          </div>
          {booking.scheduled_time && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Heure :</span>
              <span>{booking.scheduled_time.slice(0, 5)}</span>
            </div>
          )}
          {booking.address && (
            <div className="flex items-center gap-2 md:col-span-2">
              <HiLocationMarker className="w-4 h-4 text-gray-400" />
              <span>{booking.address}</span>
            </div>
          )}
        </div>

        {booking.notes && (
          <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
            <p className="text-gray-400 text-sm mb-1">Notes</p>
            <p className="text-gray-700">{booking.notes}</p>
          </div>
        )}

        <div className="mt-8">
          <Link href={`/messages/${booking.id}`} className="btn-primary inline-flex">
            Envoyer un message
          </Link>
        </div>
      </div>
    </div>
  )
}