// src/components/providers/PrestataireCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import { HiLocationMarker, HiStar } from 'react-icons/hi'
import type { Database } from '@/lib/types/database'

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  services: { count: number }[] // agrégation
}

export default function PrestataireCard({ provider }: { provider: Profile }) {
  const serviceCount = provider.services?.[0]?.count ?? 0

  return (
    <Link href={`/prestataire/${provider.id}`}>
      <Card hover className="flex items-center gap-4 p-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          {provider.avatar_url ? (
            <Image
              src={provider.avatar_url}
              alt={provider.full_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
              {provider.full_name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{provider.full_name}</h3>
          <p className="flex items-center text-sm text-gray-500 mt-0.5">
            <HiLocationMarker className="mr-1 w-4 h-4" />
            {provider.location || 'Madagascar'}
          </p>
          <p className="flex items-center text-xs text-gray-400 mt-1">
            <HiStar className="mr-1 w-3.5 h-3.5 text-accent-500" />
            {serviceCount} service{serviceCount > 1 ? 's' : ''}
          </p>
        </div>
      </Card>
    </Link>
  )
}