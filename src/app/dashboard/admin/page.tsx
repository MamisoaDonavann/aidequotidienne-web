// src/app/dashboard/admin/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import { HiUsers, HiChartBar, HiShieldCheck } from 'react-icons/hi'

export default function AdminDashboardPage() {
  const { profile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    if (profile.role !== 'admin') {
      router.push('/')
      return
    }
    setLoading(false)
  }, [profile, router])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border p-6 h-40" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary-800 mb-2">Administration</h1>
      <p className="text-gray-500 mb-8">Gérez la plateforme AideQuotidienne</p>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/admin/utilisateurs">
          <Card hover className="p-6 flex items-center gap-4 cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <HiUsers size={28} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Utilisateurs</h2>
              <p className="text-gray-500 text-sm">Gérer les comptes et les rôles</p>
            </div>
          </Card>
        </Link>
        <Link href="/admin/statistiques">
          <Card hover className="p-6 flex items-center gap-4 cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <HiChartBar size={28} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Statistiques</h2>
              <p className="text-gray-500 text-sm">Voir l'activité de la plateforme</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}