import { cn } from '@/lib/utils'

type Props = { status: string }

export default function BookingStatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
  }

  return (
    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize', styles[status] || 'bg-gray-50 text-gray-600')}>
      {status === 'pending' && 'En attente'}
      {status === 'confirmed' && 'Confirmé'}
      {status === 'completed' && 'Terminé'}
      {status === 'cancelled' && 'Annulé'}
    </span>
  )
}