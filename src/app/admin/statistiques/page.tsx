// src/app/admin/statistiques/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/80 rounded-3xl p-8 h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Statistiques</h1>
      <p className="text-gray-500 mb-10">Aperçu de l'activité de la plateforme.</p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/80 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <HiUsers size={24} />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800">{stats.clients}</p>
            <p className="text-gray-500 text-sm">Clients</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/80 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <HiBriefcase size={24} />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800">{stats.providers}</p>
            <p className="text-gray-500 text-sm">Prestataires</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/80 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <HiClipboardList size={24} />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800">{stats.bookings}</p>
            <p className="text-gray-500 text-sm">Réservations</p>
          </div>
        </div>
      </div>
    </div>
  )
}