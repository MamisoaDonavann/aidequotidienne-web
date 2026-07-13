// src/components/messages/ConversationList.tsx
import Link from 'next/link'
import { HiChat } from 'react-icons/hi'

type Conversation = {
  id: string
  status: string
  otherName: string
  lastMessage?: string
}

export default function ConversationList({ conversations }: { conversations: Conversation[] }) {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <HiChat className="mx-auto h-12 w-12 mb-3" />
        <p className="text-xl">Aucune conversation</p>
        <p className="mt-2">Vos réservations apparaîtront ici.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <Link
          key={conv.id}
          href={`/messages/${conv.id}`}
          className="block bg-white rounded-xl border p-4 hover:shadow-md transition"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{conv.otherName}</p>
              {conv.lastMessage ? (
                <p className="text-sm text-gray-500 truncate max-w-[200px]">{conv.lastMessage}</p>
              ) : (
                <p className="text-sm text-gray-400 italic">Nouvelle conversation</p>
              )}
            </div>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full capitalize">{conv.status}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}