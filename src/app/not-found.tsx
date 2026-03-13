import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-3">
        <p className="text-5xl">🔍</p>
        <h1 className="text-2xl font-bold text-gray-900">
          Evento não encontrado
        </h1>
        <p className="text-gray-500">
          Este link de evento não existe ou foi removido.
        </p>
        <Link
          href="/"
          className="inline-block mt-2 text-blue-600 hover:underline text-sm"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
