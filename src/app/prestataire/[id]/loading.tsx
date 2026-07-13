// src/app/prestataire/[id]/loading.tsx
export default function PrestataireLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      {/* En-tête */}
      <div className="bg-white rounded-2xl border p-6 md:p-8 mb-8 flex flex-col md:flex-row gap-6">
        <div className="w-32 h-32 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
      {/* Services */}
      <div className="mb-8">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border p-5 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
      {/* Avis */}
      <div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border p-4 flex gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}