// src/app/messages/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import Link from 'next/link'
import { HiChat } from 'react-icons/hi'

export default function MessagesPage() {
  const supabase = createClient()
  const { user } = useAuth()
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const userId = user.id // TypeScript comprend maintenant que ce n'est pas null

    async function fetchConversations() {
      const { data } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          client:client_id(full_name),
          provider:provider_id(full_name),
          messages:messages(id)
        `)
        .or(`client_id.eq.${userId},provider_id.eq.${userId}`)
        .order('updated_at', { ascending: false })

      setConversations(data || [])
      setLoading(false)
    }
    fetchConversations()
  }, [user])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary-800 mb-6">Messages</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : conversations.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <HiChat className="mx-auto h-12 w-12 mb-3" />
          <p className="text-xl">Aucune conversation</p>
          <p className="mt-2">Vos réservations apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((c) => {
            const other = c.client_id === user?.id ? c.provider : c.client
            return (
              <Link key={c.id} href={`/messages/${c.id}`} className="block">
                <div className="bg-white rounded-xl border p-4 flex justify-between items-center hover:shadow-md transition">
                  <div>
                    <p className="font-medium">{other?.full_name || 'Utilisateur'}</p>
                    <p className="text-sm text-gray-500">Réservation {c.id.slice(0, 8)}</p>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{c.status}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}