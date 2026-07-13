// src/app/dashboard/prestataire/loading.tsx
export default function PrestataireDashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 w-56 bg-gray-200 rounded mb-6" />
      <div className="flex gap-2 mb-6">
        <div className="h-8 w-28 bg-gray-200 rounded-full" />
        <div className="h-8 w-28 bg-gray-200 rounded-full" />
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border p-5 flex justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-gray-200 rounded" />
              <div className="h-8 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}