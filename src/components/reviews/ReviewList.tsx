// src/components/reviews/ReviewList.tsx
import { HiStar } from 'react-icons/hi'
import type { Database } from '@/lib/types/database'

type Review = Database['public']['Tables']['reviews']['Row'] & {
  reviewer: { full_name: string; avatar_url: string | null } | null
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-gray-400 italic">Aucun avis pour le moment.</p>
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white/70 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
              {review.reviewer?.avatar_url ? (
                <img
                  src={review.reviewer.avatar_url}
                  alt={review.reviewer.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary-700 text-sm font-bold">
                  {review.reviewer?.full_name?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800">{review.reviewer?.full_name || 'Utilisateur'}</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <HiStar
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'text-amber-500' : 'text-gray-200'}`}
                  />
                ))}
                <span className="text-gray-400 text-xs ml-1">
                  {new Date(review.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
          {review.comment && (
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  )
}