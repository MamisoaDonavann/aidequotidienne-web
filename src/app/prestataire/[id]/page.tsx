// src/app/prestataire/[id]/page.tsx
import { notFound } from 'next/navigation'
import { createServerClientFromCookies } from '@/lib/supabase/server'
import ServiceCard from '@/components/providers/ServiceCard'
import ReviewList from '@/components/reviews/ReviewList'
import BookingRequestForm from '@/components/booking/BookingRequestForm'
import { HiLocationMarker, HiCalendar } from 'react-icons/hi'

export default async function ProviderProfilePage({ params }: { params: { id: string } }) {
  const supabase = createServerClientFromCookies()
  
  // Récupération du profil du prestataire
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .eq('role', 'provider')
    .single()

  if (!profile) notFound()

  // Services du prestataire
  const { data: services } = await supabase
    .from('services')
    .select('*, categories(name, slug)')
    .eq('provider_id', profile.id)
    .eq('active', true)

  // Avis reçus
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:reviewer_id(full_name, avatar_url)')
    .eq('provider_id', profile.id)
    .order('created_at', { ascending: false })

  // Note moyenne
  const avgRating =
    reviews && reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* En-tête profil */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary-100 bg-gray-100">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold">
                {profile.full_name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-primary-800">{profile.full_name}</h1>
            {profile.location && (
              <p className="flex items-center justify-center md:justify-start text-gray-500 mt-1">
                <HiLocationMarker className="mr-1" /> {profile.location}
              </p>
            )}
            {profile.bio && <p className="mt-3 text-gray-600">{profile.bio}</p>}
            <div className="mt-3 flex items-center justify-center md:justify-start gap-2">
              <div className="flex text-accent-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'text-accent-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 text-sm">{avgRating} ({reviews?.length || 0} avis)</span>
            </div>
          </div>
          <div className="md:self-start">
            <BookingRequestForm providerId={profile.id} />
          </div>
        </div>
      </div>

      {/* Services */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-primary-800 mb-4">Services proposés</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {services?.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Avis */}
      <section>
        <h2 className="text-2xl font-semibold text-primary-800 mb-4">Avis des clients</h2>
        <ReviewList reviews={reviews || []} />
      </section>
    </div>
  )
}