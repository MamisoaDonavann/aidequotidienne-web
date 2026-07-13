// src/app/dashboard/admin/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
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
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-200 rounded mb-8" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/80 rounded-3xl p-8 h-40" />
          <div className="bg-white/80 rounded-3xl p-8 h-40" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Administration</h1>
      <p className="text-gray-500 mb-10">Gérez la plateforme AideQuotidienne.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <Link href="/admin/utilisateurs">
          <div className="group bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/80 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <HiUsers size={28} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Utilisateurs</h2>
                <p className="text-gray-500 text-sm mt-1">Gérer les comptes et les rôles</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/admin/statistiques">
          <div className="group bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/80 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <HiChartBar size={28} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Statistiques</h2>
                <p className="text-gray-500 text-sm mt-1">Voir l'activité de la plateforme</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}