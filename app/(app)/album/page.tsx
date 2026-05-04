"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import StickerGrid from "@/components/StickerGrid";
import StickerInput from "@/components/StickerInput";
import { type StickerDef } from "@/lib/sticker-data";
import { cn } from "@/lib/utils";
import { BookOpen, Star, X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

type Tab = "grid" | "add";
type AddMode = "have" | "need" | "pasted";

const MODE_LABELS: Record<AddMode, { label: string; color: string; desc: string }> = {
  have: { label: "Tengo repetida", color: "text-gold-400", desc: "Figuritas que te sobran para intercambiar" },
  need: { label: "Me falta", color: "text-red-400", desc: "Figuritas que necesitás para completar el álbum" },
  pasted: { label: "Ya pegada", color: "text-verde-400", desc: "Figuritas que ya pegaste en el álbum" },
};

export default function AlbumPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>("grid");
  const [addMode, setAddMode] = useState<AddMode>("have");
  const [stickersHave, setStickersHave] = useState<string[]>([]);
  const [stickersNeed, setStickersNeed] = useState<string[]>([]);
  const [stickersPasted, setStickersPasted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSticker, setSelectedSticker] = useState<{
    sticker: StickerDef;
    currentStatus: "pasted" | "have" | "need" | "none";
  } | null>(null);

  const fetchStickers = useCallback(async () => {
    const res = await fetch("/api/user/stickers");
    if (res.ok) {
      const data = await res.json();
      setStickersHave(data.stickersHave);
      setStickersNeed(data.stickersNeed);
      setStickersPasted(data.stickersPasted);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStickers();
  }, [fetchStickers]);

  async function updateStickers(action: string, codes: string[]) {
    const res = await fetch("/api/user/stickers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, codes }),
    });
    if (res.ok) {
      const data = await res.json();
      setStickersHave(data.stickersHave);
      setStickersNeed(data.stickersNeed);
      setStickersPasted(data.stickersPasted);
      if (data.invalidCodes?.length > 0) {
        toast.error(`Códigos no reconocidos: ${data.invalidCodes.join(", ")}`);
      }
    } else {
      toast.error("Error al actualizar figuritas");
    }
  }

  function handleStickerClick(sticker: StickerDef, currentStatus: "pasted" | "have" | "need" | "none") {
    setSelectedSticker({ sticker, currentStatus });
  }

  async function handleStickerAction(action: string) {
    if (!selectedSticker) return;
    await updateStickers(action, [selectedSticker.sticker.code]);
    setSelectedSticker(null);
  }

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
        <BookOpen className="w-6 h-6 text-gold-400" />
        <h1 className="text-xl font-bold text-white">Mi Álbum</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-dark-800 rounded-xl p-1">
        {(["grid", "add"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-semibold transition-colors",
              tab === t ? "bg-gold-500 text-black" : "text-gray-400 hover:text-white"
            )}
          >
            {t === "grid" ? "Ver grilla" : "Cargar figuritas"}
          </button>
        ))}
      </div>

      {tab === "grid" && (
        <StickerGrid
          stickersHave={stickersHave}
          stickersNeed={stickersNeed}
          stickersPasted={stickersPasted}
          onStickerClick={handleStickerClick}
        />
      )}

      {tab === "add" && (
        <div className="space-y-5">
          {/* Mode selector */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300">¿Qué querés marcar?</p>
            <div className="grid grid-cols-3 gap-2">
              {(["have", "need", "pasted"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAddMode(mode)}
                  className={cn(
                    "py-2 rounded-xl border text-xs font-semibold transition-colors",
                    addMode === mode
                      ? mode === "have"
                        ? "bg-gold-500/20 border-gold-400 text-gold-400"
                        : mode === "need"
                        ? "bg-red-500/20 border-red-500 text-red-400"
                        : "bg-verde-500/20 border-verde-500 text-verde-400"
                      : "bg-dark-700 border-dark-500 text-gray-400"
                  )}
                >
                  {MODE_LABELS[mode].label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">{MODE_LABELS[addMode].desc}</p>
          </div>

          <StickerInput
            onAdd={(codes) => updateStickers(addMode, codes)}
            label={`Agregar como "${MODE_LABELS[addMode].label}"`}
            placeholder="Ej: ARG1, BRA15, FWC3, 42, 156..."
          />

          {/* Current lists */}
          <div className="space-y-3">
            {[
              { title: "Repetidas (para dar)", codes: stickersHave, color: "text-gold-400", action: "remove_have" },
              { title: "Me faltan", codes: stickersNeed, color: "text-red-400", action: "remove_need" },
              { title: "Pegadas", codes: stickersPasted, color: "text-verde-400", action: "remove_pasted" },
            ].map(({ title, codes, color, action }) => (
              <div key={title} className="bg-dark-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={cn("font-semibold text-sm", color)}>
                    {title} ({codes.length})
                  </h3>
                </div>
                {codes.length === 0 ? (
                  <p className="text-xs text-gray-500">Ninguna marcada</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {codes.slice(0, 30).map((code) => (
                      <button
                        key={code}
                        onClick={() => updateStickers(action, [code])}
                        title="Quitar"
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-mono group transition-all",
                          color === "text-gold-400"
                            ? "bg-gold-500/10 border-gold-400/30 text-gold-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
                            : color === "text-red-400"
                            ? "bg-red-500/10 border-red-500/30 text-red-300 hover:bg-dark-600 hover:border-dark-400 hover:text-gray-400"
                            : "bg-verde-500/10 border-verde-500/30 text-verde-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
                        )}
                      >
                        {code}
                        <X className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                    {codes.length > 30 && (
                      <span className="text-xs text-gray-500 self-center">
                        +{codes.length - 30} más
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticker detail modal */}
      {selectedSticker && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4"
          onClick={() => setSelectedSticker(null)}
        >
          <div
            className="w-full max-w-sm bg-dark-800 border border-dark-500 rounded-3xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{selectedSticker.sticker.flag ?? "🏆"}</span>
                  <span className="text-2xl font-black text-white font-mono">
                    {selectedSticker.sticker.code}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {selectedSticker.sticker.team ?? selectedSticker.sticker.section}
                </p>
                <p className="text-xs text-gray-500">{selectedSticker.sticker.description}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Figurita #{selectedSticker.sticker.number} del álbum
                </p>
              </div>
              <button onClick={() => setSelectedSticker(null)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleStickerAction("pasted")}
                className={cn(
                  "py-2.5 rounded-xl text-xs font-bold border transition-colors",
                  selectedSticker.currentStatus === "pasted"
                    ? "bg-verde-500/30 border-verde-500 text-verde-300"
                    : "bg-dark-700 border-dark-500 text-gray-400 hover:border-verde-500 hover:text-verde-400"
                )}
              >
                ✓ Pegada
              </button>
              <button
                onClick={() => handleStickerAction("have")}
                className={cn(
                  "py-2.5 rounded-xl text-xs font-bold border transition-colors",
                  selectedSticker.currentStatus === "have"
                    ? "bg-gold-500/30 border-gold-400 text-gold-300"
                    : "bg-dark-700 border-dark-500 text-gray-400 hover:border-gold-400 hover:text-gold-400"
                )}
              >
                ⭐ Repetida
              </button>
              <button
                onClick={() => handleStickerAction("need")}
                className={cn(
                  "py-2.5 rounded-xl text-xs font-bold border transition-colors",
                  selectedSticker.currentStatus === "need"
                    ? "bg-red-500/30 border-red-500 text-red-300"
                    : "bg-dark-700 border-dark-500 text-gray-400 hover:border-red-500 hover:text-red-400"
                )}
              >
                ✗ Me falta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
