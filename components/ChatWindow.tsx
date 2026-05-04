"use client";

import { useState, useEffect, useRef } from "react";
import { Send, CheckCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { STICKER_BY_CODE } from "@/lib/sticker-data";

interface Message {
  _id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

interface Props {
  matchId: string;
  otherUser: { name: string; image?: string };
  stickersToReceive: string[];
  stickersToGive: string[];
  tradeCompleted: boolean;
  onTradeComplete: () => void;
}

export default function ChatWindow({
  matchId,
  otherUser,
  stickersToReceive,
  stickersToGive,
  tradeCompleted,
  onTradeComplete,
}: Props) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [completing, setCompleting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchMessages() {
    const res = await fetch(`/api/chat/${matchId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages);
    }
  }

  async function sendMessage() {
    if (!text.trim() || sending) return;
    setSending(true);
    const res = await fetch(`/api/chat/${matchId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      setText("");
      await fetchMessages();
    }
    setSending(false);
  }

  async function completeTrade() {
    setCompleting(true);
    const res = await fetch(`/api/matches/${matchId}/complete`, {
      method: "POST",
    });
    if (res.ok) {
      onTradeComplete();
    }
    setCompleting(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Trade summary */}
      <div className="bg-dark-700 border-b border-dark-600 p-3 space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Intercambio pendiente
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-verde-400 font-semibold">Recibís ({stickersToReceive.length}): </span>
            <span className="text-gray-300">
              {stickersToReceive
                .slice(0, 4)
                .map((c) => {
                  const s = STICKER_BY_CODE.get(c);
                  return `${s?.flag ?? ""}${c}`;
                })
                .join(", ")}
              {stickersToReceive.length > 4 && ` +${stickersToReceive.length - 4}`}
            </span>
          </div>
          <div>
            <span className="text-gold-400 font-semibold">Dás ({stickersToGive.length}): </span>
            <span className="text-gray-300">
              {stickersToGive
                .slice(0, 4)
                .map((c) => {
                  const s = STICKER_BY_CODE.get(c);
                  return `${s?.flag ?? ""}${c}`;
                })
                .join(", ")}
              {stickersToGive.length > 4 && ` +${stickersToGive.length - 4}`}
            </span>
          </div>
        </div>
        {!tradeCompleted && stickersToReceive.length + stickersToGive.length > 0 && (
          <button
            onClick={completeTrade}
            disabled={completing}
            className="w-full py-2 bg-verde-500 hover:bg-verde-400 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors"
          >
            {completing ? "Procesando..." : "✅ Marcar intercambio como realizado"}
          </button>
        )}
        {tradeCompleted && (
          <div className="flex items-center gap-2 text-verde-400 text-sm font-semibold">
            <CheckCheck className="w-4 h-4" />
            Intercambio completado — álbumes actualizados
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-8">
            ¡Hola! Coordiná el intercambio con {otherUser.name}
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === session?.user?.id;
          return (
            <div
              key={msg._id}
              className={cn("flex", isMe ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] px-4 py-2 rounded-2xl text-sm",
                  isMe
                    ? "bg-gold-500 text-black rounded-br-sm"
                    : "bg-dark-600 text-white rounded-bl-sm"
                )}
              >
                <p>{msg.text}</p>
                <p
                  className={cn(
                    "text-[10px] mt-1",
                    isMe ? "text-black/60 text-right" : "text-gray-400"
                  )}
                >
                  {new Date(msg.createdAt).toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-dark-600 p-3 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribí un mensaje..."
          className="flex-1 px-4 py-2.5 bg-dark-700 border border-dark-500 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-400 text-sm"
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim() || sending}
          className="p-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-black rounded-xl transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
