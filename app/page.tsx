import Link from "next/link";
import { Trophy, Users, ArrowLeftRight, Star } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getStats() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/stats`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/match");

  const stats = await getStats();

  return (
    <main className="min-h-screen bg-dark-900 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gold-500 to-gold-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-gold-500/30">
            <Trophy className="w-14 h-14 text-black" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-verde-500 rounded-full flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4 text-white" />
          </div>
        </div>

        <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
          Figu<span className="text-gold-400">Swap</span>
        </h1>
        <p className="text-xl text-gold-400 font-semibold mb-4">Mundial 2026</p>
        <p className="text-gray-400 max-w-sm leading-relaxed mb-10">
          Encontrá coleccionistas cerca tuyo, hacé swipe, y completá tu álbum
          intercambiando figuritas.
        </p>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 w-full max-w-sm mb-10">
            {[
              { label: "Usuarios", value: stats.totalUsers, icon: Users },
              { label: "Matches", value: stats.confirmedMatches, icon: Star },
              {
                label: "Intercambios",
                value: stats.completedTrades,
                icon: ArrowLeftRight,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-dark-800 border border-dark-600 rounded-2xl p-4 text-center">
                <Icon className="w-5 h-5 text-gold-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-white">{value ?? "—"}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/register"
            className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-black font-bold text-lg rounded-2xl transition-colors shadow-lg shadow-gold-500/30"
          >
            Empezar gratis
          </Link>
          <Link
            href="/login"
            className="w-full py-3 border border-dark-500 hover:border-gray-400 text-white font-semibold rounded-2xl transition-colors"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="bg-dark-800 border-t border-dark-600 px-6 py-10">
        <div className="max-w-md mx-auto grid grid-cols-1 gap-4">
          {[
            {
              emoji: "📒",
              title: "Gestioná tu álbum",
              desc: "Marcá qué figuritas tenés, cuáles te faltan y cuáles ya pegaste.",
            },
            {
              emoji: "💞",
              title: "Match tipo Tinder",
              desc: "El sistema detecta quién tiene lo que necesitás y necesita lo que tenés.",
            },
            {
              emoji: "💬",
              title: "Chat para coordinar",
              desc: "Chateá con tu match y coordiná el intercambio. Se actualiza el álbum automáticamente.",
            },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="flex gap-4 items-start">
              <span className="text-3xl">{emoji}</span>
              <div>
                <h3 className="font-bold text-white">{title}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
