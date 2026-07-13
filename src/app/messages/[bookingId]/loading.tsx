// src/app/messages/[bookingId]/loading.tsx
export default function ChatRoomLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[80vh] animate-pulse">
      <div className="flex-1 bg-gray-50 rounded-2xl p-4 space-y-3 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <div className={`h-12 rounded-2xl ${i % 2 === 0 ? 'w-2/3 bg-gray-200' : 'w-1/2 bg-gray-200'}`} />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-xl" />
        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
      </div>
    </div>
  )
}