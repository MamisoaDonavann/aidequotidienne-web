// src/app/dashboard/admin/loading.tsx
export default function AdminDashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-64 bg-gray-200 rounded mb-8" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-200" />
          <div className="space-y-2">
            <div className="h-5 w-28 bg-gray-200 rounded" />
            <div className="h-3 w-40 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-200" />
          <div className="space-y-2">
            <div className="h-5 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-36 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}