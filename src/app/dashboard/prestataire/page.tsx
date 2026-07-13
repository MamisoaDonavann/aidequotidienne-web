// src/app/dashboard/prestataire/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import BookingStatusBadge from '@/components/booking/BookingStatusBadge'
import ServiceForm from '@/components/providers/ServiceForm'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { HiPlus, HiPencil, HiTrash, HiCalendar, HiUser } from 'react-icons/hi'
import { toast } from 'react-hot-toast'

export default function ProviderDashboard() {
  const supabase = createClient()
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState<'bookings' | 'services'>('bookings')
  const [bookings, setBookings] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)

  useEffect(() => {
    if (!profile?.id) return
    fetchData()
  }, [profile])

  async function fetchData() {
    setLoading(true)
    if (!profile?.id) return

    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*, client:client_id(full_name), service:service_id(title)')
      .eq('provider_id', profile.id)
      .order('created_at', { ascending: false })

    const { data: servicesData } = await supabase
      .from('services')
      .select('*, categories(name)')
      .eq('provider_id', profile.id)
      .order('created_at', { ascending: false })

    setBookings(bookingsData || [])
    setServices(servicesData || [])
    setLoading(false)
  }

  async function handleUpdateBookingStatus(bookingId: string, newStatus: string) {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId)
    if (!error) {
      toast.success('Statut mis à jour')
      fetchData()
    } else {
      toast.error('Erreur')
    }
  }

  async function handleDeleteService(serviceId: string) {
    if (!confirm('Supprimer ce service ?')) return
    const { error } = await supabase.from('services').delete().eq('id', serviceId)
    if (!error) {
      toast.success('Service supprimé')
      fetchData()
    } else {
      toast.error('Erreur')
    }
  }

  const editService = (service: any) => {
    setEditingService(service)
    setShowServiceForm(true)
  }

  const closeServiceForm = () => {
    setShowServiceForm(false)
    setEditingService(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord prestataire</h1>
      <p className="text-gray-500 mb-8">Gérez vos réservations et services.</p>

      {/* Onglets stylés */}
      <div className="flex gap-2 mb-8 bg-white/70 backdrop-blur-md rounded-2xl p-1.5 shadow-sm border border-white/80 inline-flex">
        {(['bookings', 'services'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab === 'bookings' ? 'Réservations' : 'Mes services'}
          </button>
        ))}
      </div>

      {/* Réservations */}
      {activeTab === 'bookings' && (
        <div>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/80 h-28 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <HiCalendar className="mx-auto h-12 w-12 mb-4" />
              <p className="text-xl">Aucune réservation reçue</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <Card key={b.id} className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{b.service?.title || 'Service'}</p>
                    <p className="flex items-center text-gray-500 text-sm mt-1">
                      <HiUser className="mr-1 w-4 h-4" />
                      Client : {b.client?.full_name}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      <HiCalendar className="inline mr-1 w-4 h-4" />
                      {new Date(b.scheduled_date).toLocaleDateString('fr-FR')} {b.scheduled_time?.slice(0, 5)}
                    </p>
                    <div className="mt-2">
                      <BookingStatusBadge status={b.status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {b.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}>
                          Accepter
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}>
                          Refuser
                        </Button>
                      </>
                    )}
                    {b.status === 'confirmed' && (
                      <Button size="sm" onClick={() => handleUpdateBookingStatus(b.id, 'completed')}>
                        Marquer terminé
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Services */}
      {activeTab === 'services' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Services ({services.length})</h2>
            <Button onClick={() => { setShowServiceForm(true); setEditingService(null) }}>
              <HiPlus className="mr-1" /> Ajouter un service
            </Button>
          </div>

          {showServiceForm && (
            <div className="mb-8">
              <ServiceForm
                service={editingService}
                onSuccess={() => { closeServiceForm(); fetchData() }}
                onCancel={closeServiceForm}
              />
            </div>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white/80 h-40 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <p className="text-gray-500 italic">Aucun service ajouté.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((s) => (
                <Card key={s.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{s.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{s.categories?.name}</p>
                    <p className="text-sm mt-2 font-medium text-primary-700">
                      {s.price.toLocaleString()} {s.price_unit}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editService(s)}
                      className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-primary-600 transition"
                    >
                      <HiPencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteService(s.id)}
                      className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-red-600 transition"
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}