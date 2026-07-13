import Image from 'next/image'
import Link from 'next/link'
import { HiLocationMarker, HiStar } from 'react-icons/hi'
import type { Database } from '@/lib/types/database'

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  services: { count: number }[]
}

export default function PrestataireCard({ provider }: { provider: Profile }) {
  const serviceCount = provider.services?.[0]?.count ?? 0

  return (
    <Link href={`/prestataire/${provider.id}`}>
      <div className="group bg-white/90 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0 shadow-inner">
            {provider.avatar_url ? (
              <Image src={provider.avatar_url} alt={provider.full_name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                {provider.full_name.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{provider.full_name}</h3>
            <p className="flex items-center text-sm text-gray-500 mt-0.5">
              <HiLocationMarker className="mr-1 w-4 h-4" />
              {provider.location || 'Madagascar'}
            </p>
            <p className="flex items-center text-xs text-gray-400 mt-1">
              <HiStar className="mr-1 w-3.5 h-3.5 text-amber-500" />
              {serviceCount} service{serviceCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}