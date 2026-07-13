// src/app/reservation/[id]/loading.tsx
export default function ReservationLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <div className="flex justify-between">
          <div className="h-5 w-32 bg-gray-200 rounded" />
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-10 w-40 bg-gray-200 rounded" />
      </div>
    </div>
  )
}