// src/app/admin/statistiques/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import { HiUsers, HiBriefcase, HiClipboardList } from 'react-icons/hi'

export default function AdminStatsPage() {
  const supabase = createClient()
  const { profile } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ clients: 0, providers: 0, bookings: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile || profile.role !== 'admin') {
      router.push('/')
      return
    }
    async function fetchStats() {
      const [clientsRes, providersRes, bookingsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'provider'),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
      ])
      setStats({
        clients: clientsRes.count || 0,
        providers: providersRes.count || 0,
        bookings: bookingsRes.count || 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [profile])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary-800 mb-6">Statistiques de la plateforme</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <HiUsers size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.clients}</p>
              <p className="text-gray-500 text-sm">Clients</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <HiBriefcase size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.providers}</p>
              <p className="text-gray-500 text-sm">Prestataires</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <HiClipboardList size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.bookings}</p>
              <p className="text-gray-500 text-sm">Réservations</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}