// src/app/admin/utilisateurs/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { HiTrash } from 'react-icons/hi'
import { toast } from 'react-hot-toast'

export default function AdminUsersPage() {
  const supabase = createClient()
  const { profile } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile || profile.role !== 'admin') {
      router.push('/')
      return
    }
    fetchUsers()
  }, [profile])

  async function fetchUsers() {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (!error) setUsers(data)
    setLoading(false)
  }

  const updateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    if (!error) {
      toast.success('Rôle mis à jour')
      fetchUsers()
    } else {
      toast.error('Erreur')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Supprimer cet utilisateur ? Cette action est irréversible.')) return
    toast.error('Fonction nécessite la clé admin (à implémenter)')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des utilisateurs</h1>
      <p className="text-gray-500 mb-8">Modifiez les rôles et gérez les comptes.</p>

      {loading ? (
        <div className="bg-white/80 rounded-3xl p-8 animate-pulse h-64" />
      ) : (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-white/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-6 py-4 text-left font-medium text-gray-600">Nom</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-600">Rôle</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-600">Localisation</th>
                  <th className="px-6 py-4 text-right font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{u.full_name}</td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 bg-white focus:ring-2 focus:ring-primary-500/20 outline-none"
                      >
                        <option value="client">Client</option>
                        <option value="provider">Prestataire</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{u.location || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                      >
                        <HiTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}