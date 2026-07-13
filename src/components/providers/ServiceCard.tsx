import { HiClock, HiCurrencyDollar } from 'react-icons/hi'
import type { Database } from '@/lib/types/database'

type Service = Database['public']['Tables']['services']['Row'] & {
  categories: { name: string; slug: string } | null
}

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-100 transition-all duration-200">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{service.title}</h3>
        {service.categories && (
          <span className="bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1 rounded-full">
            {service.categories.name}
          </span>
        )}
      </div>
      {service.description && (
        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{service.description}</p>
      )}
      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
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
    </div>
  )
}