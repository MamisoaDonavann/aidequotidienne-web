// src/components/messages/MessageBubble.tsx
import { cn } from '@/lib/utils'

type MessageBubbleProps = {
  content: string
  timestamp: string
  isMine: boolean
  senderName?: string
}

export default function MessageBubble({ content, timestamp, isMine, senderName }: MessageBubbleProps) {
  return (
    <div className={cn('flex mb-3', isMine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] px-4 py-2 rounded-2xl text-sm',
          isMine
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
        )}
      >
        {!isMine && senderName && (
          <p className="text-xs font-semibold text-primary-700 mb-1">{senderName}</p>
        )}
        <p>{content}</p>
        <p
          className={cn(
            'text-xs mt-1',
            isMine ? 'text-blue-100' : 'text-gray-400'
          )}
        >
          {new Date(timestamp).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}