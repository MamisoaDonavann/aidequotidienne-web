// src/app/recherche/loading.tsx
export default function RechercheLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      {/* En-tête */}
      <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
      {/* Barre de filtres */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-10 bg-gray-200 rounded" />
          <div className="w-full md:w-48 h-10 bg-gray-200 rounded" />
          <div className="w-full md:w-48 h-10 bg-gray-200 rounded" />
        </div>
      </div>
      {/* Résultats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border p-5 flex gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}