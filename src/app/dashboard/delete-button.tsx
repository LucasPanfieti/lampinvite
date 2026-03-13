'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeleteEventButton({
  eventId,
  eventTitle,
}: {
  eventId: string
  eventTitle: string
}) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    const { error } = await supabase.from('events').delete().eq('id', eventId)
    if (!error) {
      router.refresh()
    }
    setLoading(false)
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-2 py-1.5 rounded-lg transition-colors"
        >
          {loading ? '...' : 'Confirmar'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs bg-gray-100 text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-200"
        >
          Não
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Apagar "${eventTitle}"`}
      className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors text-center"
    >
      🗑️ Apagar
    </button>
  )
}
