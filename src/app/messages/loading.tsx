// src/app/messages/loading.tsx
export default function MessagesLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 w-32 bg-gray-200 rounded mb-6" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border p-4 flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-5 w-16 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}