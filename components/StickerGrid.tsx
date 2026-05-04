"use client";

import { useState, useMemo } from "react";
import { STICKERS, TEAMS, type StickerDef } from "@/lib/sticker-data";
import { cn } from "@/lib/utils";
import { Search, Filter } from "lucide-react";

type StickerStatus = "pasted" | "have" | "need" | "none";

interface Props {
  stickersHave: string[];
  stickersNeed: string[];
  stickersPasted: string[];
  onStickerClick?: (sticker: StickerDef, currentStatus: StickerStatus) => void;
  readOnly?: boolean;
}

const STATUS_COLORS: Record<StickerStatus, string> = {
  pasted: "bg-verde-500/20 border-verde-500 text-verde-400",
  have: "bg-gold-500/20 border-gold-400 text-gold-400",
  need: "bg-red-500/20 border-red-500 text-red-400",
  none: "bg-dark-600 border-dark-500 text-gray-500",
};

const STATUS_LABELS: Record<StickerStatus, string> = {
  pasted: "Pegada ✓",
  have: "Repetida",
  need: "Me falta",
  none: "Sin marcar",
};

export default function StickerGrid({
  stickersHave,
  stickersNeed,
  stickersPasted,
  onStickerClick,
  readOnly = false,
}: Props) {
  const [search, setSearch] = useState("");
  const [filterTeam, setFilterTeam] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState<StickerStatus | "ALL">("ALL");

  const haveSet = useMemo(() => new Set(stickersHave), [stickersHave]);
  const needSet = useMemo(() => new Set(stickersNeed), [stickersNeed]);
  const pastedSet = useMemo(() => new Set(stickersPasted), [stickersPasted]);

  function getStatus(code: string): StickerStatus {
    if (pastedSet.has(code)) return "pasted";
    if (haveSet.has(code)) return "have";
    if (needSet.has(code)) return "need";
    return "none";
  }

  const filtered = useMemo(() => {
    const q = search.trim().toUpperCase();
    return STICKERS.filter((s) => {
      if (filterTeam !== "ALL" && s.section !== filterTeam) return false;
      if (filterStatus !== "ALL" && getStatus(s.code) !== filterStatus) return false;
      if (q) {
        return (
          s.code.includes(q) ||
          s.number.toString().includes(q) ||
          s.description.toUpperCase().includes(q) ||
          (s.team && s.team.toUpperCase().includes(q))
        );
      }
      return true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterTeam, filterStatus, stickersHave, stickersNeed, stickersPasted]);

  const stats = useMemo(
    () => ({
      pasted: stickersPasted.length,
      have: stickersHave.length,
      need: stickersNeed.length,
      total: 980,
    }),
    [stickersHave, stickersNeed, stickersPasted]
  );

  const teamOptions = [
    { code: "ALL", name: "Todas", flag: "🌍" },
    { code: "FWC", name: "FWC Especiales", flag: "🏆" },
    ...TEAMS.map((t) => ({ code: t.code, name: t.name, flag: t.flag })),
  ];

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Pegadas", value: stats.pasted, color: "text-verde-400" },
          { label: "Repetidas", value: stats.have, color: "text-gold-400" },
          { label: "Faltantes", value: stats.need, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="bg-dark-700 rounded-xl p-3 text-center">
            <div className={cn("text-2xl font-bold", s.color)}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por código, número o selección..."
          className="w-full pl-9 pr-4 py-2.5 bg-dark-700 border border-dark-500 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-400 text-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {(["ALL", "pasted", "have", "need", "none"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              filterStatus === status
                ? "bg-gold-500 border-gold-400 text-black"
                : "bg-dark-700 border-dark-500 text-gray-400 hover:border-gray-400"
            )}
          >
            {status === "ALL" ? "Todas" : STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {/* Team selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {teamOptions.map((t) => (
          <button
            key={t.code}
            onClick={() => setFilterTeam(t.code)}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              filterTeam === t.code
                ? "bg-gold-500 border-gold-400 text-black"
                : "bg-dark-700 border-dark-500 text-gray-400 hover:border-gray-400"
            )}
          >
            <span>{t.flag}</span>
            <span>{t.code === "ALL" ? "Todas" : t.code}</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500">
        {filtered.length} figurita{filtered.length !== 1 ? "s" : ""} mostrada{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
        {filtered.map((sticker) => {
          const status = getStatus(sticker.code);
          return (
            <button
              key={sticker.code}
              onClick={() => !readOnly && onStickerClick?.(sticker, status)}
              title={`${sticker.flag ?? ""} ${sticker.code} — ${sticker.team ?? sticker.section} — ${sticker.description}`}
              className={cn(
                "aspect-square rounded-lg border-2 text-[9px] font-bold font-mono flex flex-col items-center justify-center gap-0 transition-all p-0.5",
                STATUS_COLORS[status],
                !readOnly && "hover:scale-110 hover:z-10 cursor-pointer active:scale-95",
                readOnly && "cursor-default"
              )}
            >
              <span className="text-[10px] leading-none">{sticker.flag ?? "🏆"}</span>
              <span className="leading-none">{sticker.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
