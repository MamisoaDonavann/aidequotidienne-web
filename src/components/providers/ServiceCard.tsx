// src/components/providers/ServiceCard.tsx
import Card from '@/components/ui/Card'
import { HiClock, HiCurrencyDollar } from 'react-icons/hi'
import type { Database } from '@/lib/types/database'

type Service = Database['public']['Tables']['services']['Row'] & {
  categories: { name: string; slug: string } | null
}

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="p-5 space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{service.title}</h3>
        {service.categories && (
          <span className="bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {service.categories.name}
          </span>
        )}
      </div>
      {service.description && (
        <p className="text-gray-600 text-sm line-clamp-2">{service.description}</p>
      )}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <HiCurrencyDollar className="w-4 h-4" />
          {service.price.toLocaleString()} {service.price_unit}
        </span>
        {service.duration_minutes && (
          <span className="flex items-center gap-1">
            <HiClock className="w-4 h-4" />
            {service.duration_minutes} min
          </span>
        )}
      </div>
    </Card>
  )
}