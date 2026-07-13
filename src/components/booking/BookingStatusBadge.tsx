// src/components/booking/BookingStatusBadge.tsx
import { cn } from '@/lib/utils'

type Props = { status: string }

export default function BookingStatusBadge({ status }: Props) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'

  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <span className={cn(baseClasses, styles[status] || 'bg-gray-100 text-gray-700')}>
      {status === 'pending' && 'En attente'}
      {status === 'confirmed' && 'Confirmé'}
      {status === 'completed' && 'Terminé'}
      {status === 'cancelled' && 'Annulé'}
    </span>
  )
}