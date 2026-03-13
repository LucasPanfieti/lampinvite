import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import RSVPForm from './rsvp-form'

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!event) notFound()

  const { count } = await supabase
    .from('rsvps')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event.id)
    .eq('status', 'confirmed')

  const confirmedCount = count ?? 0
  const isFull =
    event.max_guests != null && confirmedCount >= event.max_guests

  const mapsQuery = encodeURIComponent(event.location_address)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <p className="text-3xl">🎉</p>
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          {event.description && (
            <p className="text-gray-500 text-base">{event.description}</p>
          )}
        </div>

        {/* Details card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          <div className="flex gap-3 items-start">
            <span className="text-xl shrink-0">🗓</span>
            <div>
              <p className="font-medium text-gray-800 text-sm">
                {format(
                  new Date(event.date),
                  "EEEE, dd 'de' MMMM 'de' yyyy",
                  { locale: ptBR }
                )}
              </p>
              <p className="text-gray-500 text-sm">
                {format(new Date(event.date), "HH:mm'h'")}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <span className="text-xl shrink-0">📍</span>
            <div>
              <p className="font-medium text-gray-800 text-sm">
                {event.location_name}
              </p>
              <p className="text-gray-500 text-sm">{event.location_address}</p>
            </div>
          </div>

          {event.max_guests != null && (
            <div className="flex gap-3 items-center">
              <span className="text-xl shrink-0">👥</span>
              <p className="text-sm text-gray-600">
                {confirmedCount} de {event.max_guests} confirmados
              </p>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden border border-gray-200">
          <iframe
            title="Localização do evento"
            width="100%"
            height="280"
            style={{ border: 0, display: 'block' }}
            loading="lazy"
            src={`https://maps.google.com/maps?q=${mapsQuery}&output=embed`}
          />
        </div>

        {/* RSVP */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Confirmar presença
          </h2>
          {isFull ? (
            <div className="text-center py-4">
              <p className="text-2xl mb-2">😔</p>
              <p className="text-red-500 font-medium">Vagas esgotadas</p>
              <p className="text-gray-400 text-sm">
                Não há mais vagas disponíveis para este evento.
              </p>
            </div>
          ) : (
            <RSVPForm eventId={event.id} />
          )}
        </div>
      </div>
    </div>
  )
}
