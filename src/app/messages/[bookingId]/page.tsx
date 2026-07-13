// src/app/messages/[bookingId]/page.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { HiPaperAirplane } from 'react-icons/hi'
import { toast } from 'react-hot-toast'

export default function ChatRoom() {
  const supabase = createClient()
  const { bookingId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bookingId || !user) return

    supabase
      .from('messages')
      .select('*, sender:sender_id(full_name)')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages(data || [])
        setLoading(false)
      })

    const channel = supabase
      .channel(`room-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [bookingId, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    const { error } = await supabase.from('messages').insert({
      booking_id: bookingId as string,
      sender_id: user.id,
      content: newMessage.trim(),
      message_type: 'text',
    })
    if (error) toast.error('Erreur lors de l’envoi')
    setNewMessage('')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[85vh] animate-fade-in">
      <div className="flex-1 overflow-y-auto space-y-4 mb-6 bg-gradient-to-b from-gray-50/50 to-white rounded-3xl p-6 shadow-inner">
        {loading ? (
          <div className="text-center text-gray-400 mt-10">Chargement...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">Démarrez la conversation.</div>
        ) : (
          messages.map((msg: any) => {
            const isMine = msg.sender_id === user?.id
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm ${
                    isMine
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-br-md shadow-md shadow-primary-500/20'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                  }`}
                >
                  {!isMine && (
                    <p className="text-xs font-semibold text-primary-700 mb-1">
                      {msg.sender?.full_name || 'Utilisateur'}
                    </p>
                  )}
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-3">
        <Input
          placeholder="Votre message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!newMessage.trim()} size="md">
          <HiPaperAirplane className="w-5 h-5" />
        </Button>
      </form>
    </div>
  )
}