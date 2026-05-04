"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ArrowLeftRight } from "lucide-react";
import { useSession } from "next-auth/react";

interface MatchItem {
  _id: string;
  otherUser: { _id: string; name: string; image?: string; city?: string };
  stickersToReceive: number;
  stickersToGive: number;
  tradeCompleted: boolean;
  lastMessage?: string;
  updatedAt: string;
}

export default function ChatListPage() {
  const { data: session } = useSession();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matches/confirmed")
      .then((r) => r.json())
      .then((d) => {
        setMatches(d.matches ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-gold-400" />
        <h1 className="text-xl font-bold text-white">Chats</h1>
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageCircle className="w-14 h-14 text-gray-600 mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Sin matches aún</h2>
          <p className="text-gray-400 text-sm max-w-xs">
            Cuando hagas match con otro coleccionista vas a poder chatear acá.
          </p>
          <Link
            href="/match"
            className="mt-5 px-6 py-3 bg-gold-500 text-black font-bold rounded-xl hover:bg-gold-400 transition-colors"
          >
            Buscar matches
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {matches.map((m) => (
            <Link
              key={m._id}
              href={`/chat/${m._id}`}
              className="flex items-center gap-3 p-4 bg-dark-800 border border-dark-600 rounded-2xl hover:border-dark-400 transition-colors"
            >
              {m.otherUser.image ? (
                <Image
                  src={m.otherUser.image}
                  alt={m.otherUser.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold-400"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-dark-600 border-2 border-gold-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-gold-400">
                    {m.otherUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white truncate">{m.otherUser.name}</h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {new Date(m.updatedAt).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                  <span className="text-xs text-gray-400 truncate">
                    {m.stickersToReceive} recibís · {m.stickersToGive} das
                  </span>
                  {m.tradeCompleted && (
                    <span className="text-xs text-verde-400 font-semibold flex-shrink-0">
                      ✓ Completado
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
