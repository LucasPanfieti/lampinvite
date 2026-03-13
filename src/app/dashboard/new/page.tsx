"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${Date.now().toString(36)}`;
}

export default function NewEventPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const title = form.get("title") as string;
    const description = form.get("description") as string;
    const date = form.get("date") as string;
    const location_name = form.get("location_name") as string;
    const location_address = form.get("location_address") as string;
    const max_guests_raw = form.get("max_guests") as string;

    const payload: Record<string, unknown> = {
      user_id: user.id,
      title,
      description: description || null,
      date,
      location_name,
      location_address,
      slug: generateSlug(title),
    };

    if (max_guests_raw && max_guests_raw !== "") {
      payload.max_guests = Number(max_guests_raw);
    }

    const { error: err } = await supabase.from("events").insert(payload);

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Voltar
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Criar evento</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome do evento *
              </label>
              <input
                id="title"
                name="title"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Aniversário da Maria"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição (opcional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Fale um pouco sobre o evento..."
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Data e hora *
              </label>
              <input
                id="date"
                name="date"
                type="datetime-local"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="location_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome do local *
              </label>
              <input
                id="location_name"
                name="location_name"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Espaço Aurora, Casa da família"
              />
            </div>

            <div>
              <label
                htmlFor="location_address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Endereço completo *
              </label>
              <input
                id="location_address"
                name="location_address"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Rua das Flores, 123, São Paulo, SP"
              />
            </div>

            <div>
              <label
                htmlFor="max_guests"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Limite de convidados (opcional)
              </label>
              <input
                id="max_guests"
                name="max_guests"
                type="number"
                min={1}
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
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors"
              >
                {loading ? "Criando..." : "Criar evento"}
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
  );
}
