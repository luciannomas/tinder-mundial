"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ChatWindow from "@/components/ChatWindow";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface MatchData {
  _id: string;
  user1: { _id: string; name: string; image?: string; city?: string };
  user2: { _id: string; name: string; image?: string; city?: string };
  stickersUser1ToUser2: string[];
  stickersUser2ToUser1: string[];
  tradeCompleted: boolean;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const matchId = params.matchId as string;

  const [match, setMatch] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/chat/${matchId}`)
      .then((r) => r.json())
      .then((d) => {
        setMatch(d.match);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [matchId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-7rem)]">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!match || !session?.user?.id) return null;

  const isUser1 = match.user1._id === session.user.id;
  const otherUser = isUser1 ? match.user2 : match.user1;
  const stickersToReceive = isUser1
    ? match.stickersUser2ToUser1
    : match.stickersUser1ToUser2;
  const stickersToGive = isUser1
    ? match.stickersUser1ToUser2
    : match.stickersUser2ToUser1;

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-dark-600 bg-dark-800">
        <button
          onClick={() => router.back()}
          className="p-1.5 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {otherUser.image ? (
          <Image
            src={otherUser.image}
            alt={otherUser.name}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border-2 border-gold-400"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-dark-600 border-2 border-gold-400 flex items-center justify-center">
            <span className="font-bold text-gold-400">
              {otherUser.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h2 className="font-bold text-white text-sm">{otherUser.name}</h2>
          {otherUser.city && (
            <p className="text-xs text-gray-400">{otherUser.city}</p>
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow
          matchId={matchId}
          otherUser={otherUser}
          stickersToReceive={stickersToReceive}
          stickersToGive={stickersToGive}
          tradeCompleted={match.tradeCompleted}
          onTradeComplete={() =>
            setMatch((m) => m ? { ...m, tradeCompleted: true } : m)
          }
        />
      </div>
    </div>
  );
}
