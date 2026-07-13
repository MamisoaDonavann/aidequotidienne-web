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
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary-800 mb-6">Gestion des utilisateurs</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Nom</th>
                <th className="px-4 py-3 text-left">Rôle</th>
                <th className="px-4 py-3 text-left">Localisation</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3">{u.full_name}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="client">Client</option>
                      <option value="provider">Prestataire</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">{u.location || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700">
                      <HiTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}