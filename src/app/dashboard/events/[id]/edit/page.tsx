'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [eventId, setEventId] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [locationName, setLocationName] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [maxGuests, setMaxGuests] = useState('')

  useEffect(() => {
    async function load() {
      const { id } = await params
      setEventId(id)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: event, error: err } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (err || !event) {
        router.push('/dashboard')
        return
      }

      setTitle(event.title)
      setDescription(event.description ?? '')
      // Format date for datetime-local input
      const d = new Date(event.date)
      const pad = (n: number) => String(n).padStart(2, '0')
      const localDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
      setDate(localDate)
      setLocationName(event.location_name)
      setLocationAddress(event.location_address)
      setMaxGuests(event.max_guests ? String(event.max_guests) : '')
      setFetching(false)
    }
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload: Record<string, unknown> = {
      title,
      description: description || null,
      date,
      location_name: locationName,
      location_address: locationAddress,
      max_guests: maxGuests !== '' ? Number(maxGuests) : null,
    }

    const { error: err } = await supabase
      .from('events')
      .update(payload)
      .eq('id', eventId)

    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            ← Voltar
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Editar evento</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do evento *
              </label>
              <input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição (opcional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Data e hora *
              </label>
              <input
                id="date"
                type="datetime-local"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="location_name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do local *
              </label>
              <input
                id="location_name"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="location_address" className="block text-sm font-medium text-gray-700 mb-1">
                Endereço completo *
              </label>
              <input
                id="location_address"
                value={locationAddress}
                onChange={e => setLocationAddress(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="max_guests" className="block text-sm font-medium text-gray-700 mb-1">
                Limite de convidados (opcional)
              </label>
              <input
                id="max_guests"
                type="number"
                min={1}
                value={maxGuests}
                onChange={e => setMaxGuests(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Deixe em branco para sem limite"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors"
              >
                {loading ? 'Salvando...' : 'Salvar alterações'}
              </button>
              <Link
                href="/dashboard"
                className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
