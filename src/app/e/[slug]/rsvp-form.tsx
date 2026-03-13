'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RSVPForm({ eventId }: { eventId: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase.from('rsvps').insert({
      event_id: eventId,
      name,
      email,
      status: 'confirmed',
    })

    if (err) {
      if (err.code === '23505') {
        setError('Este email já confirmou presença neste evento!')
      } else {
        setError(err.message)
      }
    } else {
      setDone(true)
    }

    setLoading(false)
  }

  if (done) {
    return (
      <div className="text-center py-6 space-y-2">
        <p className="text-4xl">✅</p>
        <p className="text-lg font-semibold text-green-700">
          Presença confirmada!
        </p>
        <p className="text-gray-500 text-sm">
          Até lá, {name}! 🎉
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Seu nome *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="João Silva"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Seu email *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="joao@email.com"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
      >
        {loading ? 'Confirmando...' : '✅ Confirmar presença'}
      </button>
    </form>
  )
}
