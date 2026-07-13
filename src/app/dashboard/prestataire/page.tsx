// src/app/dashboard/prestataire/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import BookingStatusBadge from '@/components/booking/BookingStatusBadge'
import ServiceForm from '@/components/providers/ServiceForm'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
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
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary-800 mb-6">Tableau de bord prestataire</h1>

      <div className="flex gap-2 mb-6">
        {(['bookings', 'services'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab === 'bookings' ? 'Réservations' : 'Mes services'}
          </button>
        ))}
      </div>

      {activeTab === 'bookings' && (
        <div>
          {loading ? (
            <p>Chargement...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500">Aucune réservation reçue.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <Card key={b.id} className="flex flex-col md:flex-row justify-between gap-3">
                  <div>
                    <p className="font-semibold">{b.service?.title || 'Service'}</p>
                    <p className="text-sm text-gray-500">Client : {b.client?.full_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(b.scheduled_date).toLocaleDateString('fr-FR')} {b.scheduled_time?.slice(0, 5)}
                    </p>
                    <BookingStatusBadge status={b.status} />
                  </div>
                  {b.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}>Accepter</Button>
                      <Button size="sm" variant="outline" onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}>Refuser</Button>
                    </div>
                  )}
                  {b.status === 'confirmed' && (
                    <Button size="sm" onClick={() => handleUpdateBookingStatus(b.id, 'completed')}>Marquer terminé</Button>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'services' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Services ({services.length})</h2>
            <Button onClick={() => { setShowServiceForm(true); setEditingService(null) }}>
              <HiPlus className="mr-1" /> Ajouter un service
            </Button>
          </div>

          {showServiceForm && (
            <div className="mb-6">
              <ServiceForm
                service={editingService}
                onSuccess={() => { closeServiceForm(); fetchData() }}
                onCancel={closeServiceForm}
              />
            </div>
          )}

          {loading ? (
            <p>Chargement...</p>
          ) : services.length === 0 ? (
            <p className="text-gray-500">Aucun service ajouté.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((s) => (
                <Card key={s.id} className="flex justify-between">
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-sm text-gray-500">{s.categories?.name}</p>
                    <p className="text-sm">{s.price.toLocaleString()} {s.price_unit}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editService(s)} className="text-gray-500 hover:text-primary-600"><HiPencil size={18} /></button>
                    <button onClick={() => handleDeleteService(s.id)} className="text-gray-500 hover:text-red-600"><HiTrash size={18} /></button>
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