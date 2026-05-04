"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Heart, X, Star, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { STICKER_BY_CODE } from "@/lib/sticker-data";

export interface Candidate {
  _id: string;
  name: string;
  image?: string;
  city?: string;
  distanceKm?: number | null;
  iCanGive: string[];
  theyCanGive: string[];
  isPerfect: boolean;
  isPartial: boolean;
  matchScore: number;
}

interface Props {
  candidate: Candidate;
  onSwipe: (direction: "right" | "left", candidateId: string) => void;
  onShowDetail: (candidate: Candidate) => void;
  isTop: boolean;
}

export default function SwipeCard({ candidate, onSwipe, onShowDetail, isTop }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);

  const [dragging, setDragging] = useState(false);
  const constraintsRef = useRef(null);

  async function handleDragEnd() {
    const xVal = x.get();
    if (xVal > 100) {
      await animate(x, 500, { duration: 0.3 });
      onSwipe("right", candidate._id);
    } else if (xVal < -100) {
      await animate(x, -500, { duration: 0.3 });
      onSwipe("left", candidate._id);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
    }
    setDragging(false);
  }

  if (!isTop) {
    return (
      <div className="absolute inset-0 rounded-3xl bg-dark-700 border border-dark-500 scale-95 opacity-60" />
    );
  }

  const matchBadge = candidate.isPerfect
    ? { label: "Match Perfecto ⭐", color: "bg-gold-500 text-black" }
    : candidate.isPartial
    ? { label: "Match Parcial", color: "bg-verde-600 text-white" }
    : { label: "Sin match directo", color: "bg-dark-500 text-gray-400" };

  return (
    <motion.div
      ref={constraintsRef}
      style={{ x, rotate, opacity }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => setDragging(true)}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-700 via-dark-800 to-dark-900 border border-dark-500" />

      {/* Like / Nope overlays */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-8 left-6 z-10 rotate-[-20deg] border-4 border-verde-400 rounded-xl px-4 py-2"
      >
        <span className="text-verde-400 font-black text-3xl tracking-widest">ME SIRVE</span>
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-8 right-6 z-10 rotate-[20deg] border-4 border-red-500 rounded-xl px-4 py-2"
      >
        <span className="text-red-500 font-black text-3xl tracking-widest">PASO</span>
      </motion.div>

      {/* Avatar */}
      <div className="relative flex flex-col h-full">
        <div className="flex-shrink-0 flex items-center justify-center pt-10 pb-4">
          {candidate.image ? (
            <Image
              src={candidate.image}
              alt={candidate.name}
              width={120}
              height={120}
              className="w-28 h-28 rounded-full object-cover border-4 border-gold-400"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-dark-600 border-4 border-gold-400 flex items-center justify-center">
              <span className="text-5xl font-bold text-gold-400">
                {candidate.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 px-6 pb-6 space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{candidate.name}</h2>
            {(candidate.city || candidate.distanceKm !== null) && (
              <div className="flex items-center justify-center gap-1.5 text-gray-400 text-sm mt-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {candidate.city}
                  {candidate.distanceKm !== null &&
                    candidate.distanceKm !== undefined &&
                    ` · ${Math.round(candidate.distanceKm)} km`}
                </span>
              </div>
            )}
          </div>

          {/* Match badge */}
          <div className="flex justify-center">
            <span
              className={cn("px-3 py-1 rounded-full text-sm font-semibold", matchBadge.color)}
            >
              {matchBadge.label}
            </span>
          </div>

          {/* Sticker exchange preview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-dark-700/60 rounded-2xl p-3 border border-verde-600/30">
              <p className="text-xs text-verde-400 font-semibold mb-2">
                Te pueden dar ({candidate.theyCanGive.length})
              </p>
              {candidate.theyCanGive.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {candidate.theyCanGive.slice(0, 6).map((code) => {
                    const s = STICKER_BY_CODE.get(code);
                    return (
                      <span
                        key={code}
                        className="text-[10px] font-mono bg-verde-600/20 border border-verde-500/40 text-verde-300 px-1.5 py-0.5 rounded-full"
                      >
                        {s?.flag ?? ""} {code}
                      </span>
                    );
                  })}
                  {candidate.theyCanGive.length > 6 && (
                    <span className="text-[10px] text-gray-500">+{candidate.theyCanGive.length - 6}</span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Ninguna</p>
              )}
            </div>

            <div className="bg-dark-700/60 rounded-2xl p-3 border border-gold-500/30">
              <p className="text-xs text-gold-400 font-semibold mb-2">
                Podés dar ({candidate.iCanGive.length})
              </p>
              {candidate.iCanGive.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {candidate.iCanGive.slice(0, 6).map((code) => {
                    const s = STICKER_BY_CODE.get(code);
                    return (
                      <span
                        key={code}
                        className="text-[10px] font-mono bg-gold-500/20 border border-gold-400/40 text-gold-300 px-1.5 py-0.5 rounded-full"
                      >
                        {s?.flag ?? ""} {code}
                      </span>
                    );
                  })}
                  {candidate.iCanGive.length > 6 && (
                    <span className="text-[10px] text-gray-500">+{candidate.iCanGive.length - 6}</span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Ninguna</p>
              )}
            </div>
          </div>

          {/* Detail button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowDetail(candidate);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dark-500 text-gray-400 hover:text-white hover:border-gray-400 transition-colors text-sm"
          >
            Ver detalle completo <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Action buttons below the card
export function SwipeActions({
  onLeft,
  onRight,
}: {
  onLeft: () => void;
  onRight: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-10">
      <button
        onClick={onLeft}
        className="w-16 h-16 rounded-full bg-dark-700 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg hover:scale-110"
      >
        <X className="w-8 h-8" />
      </button>
      <button
        onClick={onRight}
        className="w-16 h-16 rounded-full bg-dark-700 border-2 border-verde-500 text-verde-400 hover:bg-verde-500 hover:text-white transition-all flex items-center justify-center shadow-lg hover:scale-110"
      >
        <Heart className="w-8 h-8" />
      </button>
    </div>
  );
}
