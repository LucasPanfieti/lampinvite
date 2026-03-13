import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!event) notFound()

  const { data: rsvps } = await supabase
    .from('rsvps')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: false })

  const confirmed = rsvps?.filter((r) => r.status === 'confirmed') ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Voltar
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {event.title}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Event info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-2">
          <p className="text-sm text-gray-600">
            🗓{' '}
            {format(
              new Date(event.date),
              "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
              { locale: ptBR }
            )}
          </p>
          <p className="text-sm text-gray-600">📍 {event.location_name}</p>
          <p className="text-sm text-gray-500">{event.location_address}</p>
          <div className="pt-2 flex gap-3">
            <Link
              href={`/e/${event.slug}`}
              target="_blank"
              className="text-sm bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100"
            >
              Ver página do evento ↗
            </Link>
          </div>
        </div>

        {/* Guest list */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">
              Confirmados ({confirmed.length}
              {event.max_guests ? ` / ${event.max_guests}` : ''})
            </h2>
          </div>

          {confirmed.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">
              Nenhuma confirmação ainda. Compartilhe o link do evento!
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {confirmed.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {rsvp.name}
                    </p>
                    <p className="text-xs text-gray-500">{rsvp.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {format(new Date(rsvp.created_at), "dd/MM 'às' HH:mm")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
