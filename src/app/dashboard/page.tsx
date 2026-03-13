import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import DeleteEventButton from "./delete-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: events } = await supabase
    .from("events")
    .select("id, title, date, slug, location_name, max_guests")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">🎉 LampInvite</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              {user.email}
            </span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Meus Eventos</h2>
          <Link
            href="/dashboard/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Novo Evento
          </Link>
        </div>

        {(!events || events.length === 0) && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-lg font-medium text-gray-500">
              Nenhum evento ainda
            </p>
            <p className="text-sm mt-1">Crie seu primeiro evento agora!</p>
            <Link
              href="/dashboard/new"
              className="inline-block mt-4 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Criar evento
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {events?.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {event.location_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    🗓{" "}
                    {format(
                      new Date(event.date),
                      "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                      {
                        locale: ptBR,
                      },
                    )}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <Link
                    href={`/e/${event.slug}`}
                    target="_blank"
                    className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 text-center"
                  >
                    Ver convite ↗
                  </Link>
                  <Link
                    href={`/dashboard/events/${event.id}`}
                    className="text-xs bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-center"
                  >
                    Convidados
                  </Link>
                  <Link
                    href={`/dashboard/events/${event.id}/edit`}
                    className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 text-center"
                  >
                    ✏️ Editar
                  </Link>
                  <DeleteEventButton
                    eventId={event.id}
                    eventTitle={event.title}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
