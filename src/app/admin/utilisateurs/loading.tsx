// src/app/admin/utilisateurs/loading.tsx
export default function AdminUsersLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 w-56 bg-gray-200 rounded mb-6" />
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="h-10 bg-gray-100" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 p-3 border-t">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/6" />
            <div className="h-4 bg-gray-200 rounded w-1/6" />
            <div className="h-4 bg-gray-200 rounded w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}