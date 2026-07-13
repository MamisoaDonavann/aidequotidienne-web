import { notFound } from 'next/navigation'
import { createServerClientFromCookies } from '@/lib/supabase/server'
import ServiceCard from '@/components/providers/ServiceCard'
import ReviewList from '@/components/reviews/ReviewList'
import BookingRequestForm from '@/components/booking/BookingRequestForm'
import { HiLocationMarker, HiStar } from 'react-icons/hi'

export default async function ProviderProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createServerClientFromCookies()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .eq('role', 'provider')
    .single()

  if (!profile) notFound()

  const { data: services } = await supabase
    .from('services')
    .select('*, categories(name, slug)')
    .eq('provider_id', profile.id)
    .eq('active', true)

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:reviewer_id(full_name, avatar_url)')
    .eq('provider_id', profile.id)
    .order('created_at', { ascending: false })

  const avgRating =
    reviews && reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      {/* En-tête */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/80 mb-10">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 shadow-inner">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary-700 text-4xl font-bold">
                {profile.full_name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{profile.full_name}</h1>
            {profile.location && (
              <p className="flex items-center justify-center md:justify-start text-gray-500 mt-2">
                <HiLocationMarker className="mr-1.5 h-5 w-5" /> {profile.location}
              </p>
            )}
            {profile.bio && <p className="mt-4 text-gray-600 max-w-xl">{profile.bio}</p>}
            <div className="mt-4 flex items-center justify-center md:justify-start gap-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'text-amber-500' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-gray-500 text-sm">{avgRating} ({reviews?.length || 0} avis)</span>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <BookingRequestForm providerId={profile.id} />
          </div>
        </div>
      </div>

      {/* Services */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Services proposés</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {services?.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
          {(!services || services.length === 0) && (
            <p className="text-gray-500 italic">Aucun service pour le moment.</p>
          )}
        </div>
      </section>

      {/* Avis */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Avis des clients</h2>
        <ReviewList reviews={reviews || []} />
      </section>
    </div>
  )
}