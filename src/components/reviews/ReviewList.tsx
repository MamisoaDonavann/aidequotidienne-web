// src/components/reviews/ReviewList.tsx
import { HiStar } from 'react-icons/hi'
import type { Database } from '@/lib/types/database'

type Review = Database['public']['Tables']['reviews']['Row'] & {
  reviewer: { full_name: string; avatar_url: string | null } | null
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-gray-500 italic">Aucun avis pour le moment.</p>
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              {review.reviewer?.avatar_url ? (
                <img
                  src={review.reviewer.avatar_url}
                  alt={review.reviewer.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-bold">
                  {review.reviewer?.full_name?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{review.reviewer?.full_name || 'Utilisateur'}</p>
              <div className="flex items-center gap-1 text-sm">
                <div className="flex text-accent-500">
                  {[...Array(5)].map((_, i) => (
                    <HiStar
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-accent-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-xs">
                  {new Date(review.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
          {review.comment && <p className="mt-2 text-gray-600 text-sm">{review.comment}</p>}
        </div>
      ))}
    </div>
  )
}