"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeftRight, Star } from "lucide-react";
import Image from "next/image";
import { type Candidate } from "./SwipeCard";
import { STICKER_BY_CODE } from "@/lib/sticker-data";

interface Props {
  candidate: Candidate | null;
  onClose: () => void;
  onSwipe: (direction: "right" | "left", id: string) => void;
}

function StickerList({ codes, color }: { codes: string[]; color: "green" | "gold" }) {
  if (codes.length === 0) return <p className="text-sm text-gray-500">Ninguna</p>;

  const borderClass =
    color === "green" ? "border-verde-500/40 bg-verde-600/10 text-verde-300" : "border-gold-400/40 bg-gold-500/10 text-gold-300";

  return (
    <div className="flex flex-wrap gap-1.5">
      {codes.map((code) => {
        const s = STICKER_BY_CODE.get(code);
        return (
          <span
            key={code}
            title={s ? `${s.team ?? s.section} — ${s.description}` : code}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-mono ${borderClass}`}
          >
            {s?.flag ?? "🏆"} {code}
          </span>
        );
      })}
    </div>
  );
}

export default function MatchDetailModal({ candidate, onClose, onSwipe }: Props) {
  if (!candidate) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      >
        <motion.div
          key="modal"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-dark-800 border border-dark-500 rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-dark-800 border-b border-dark-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {candidate.image ? (
                <Image
                  src={candidate.image}
                  alt={candidate.name}
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full object-cover border-2 border-gold-400"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-dark-600 border-2 border-gold-400 flex items-center justify-center">
                  <span className="text-xl font-bold text-gold-400">
                    {candidate.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h2 className="font-bold text-white">{candidate.name}</h2>
                {candidate.city && (
                  <p className="text-xs text-gray-400">{candidate.city}</p>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-5">
            {/* Badge */}
            {candidate.isPerfect && (
              <div className="flex items-center gap-2 bg-gold-500/10 border border-gold-400/30 rounded-2xl p-3">
                <Star className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <div>
                  <p className="text-gold-400 font-bold text-sm">¡Match Perfecto!</p>
                  <p className="text-xs text-gray-400">
                    Se pueden intercambiar figuritas en ambas direcciones
                  </p>
                </div>
              </div>
            )}

            {/* Exchange details */}
            <div className="bg-dark-700 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <ArrowLeftRight className="w-4 h-4 text-gold-400" />
                Detalle del intercambio posible
              </div>

              {/* They give me */}
              <div>
                <p className="text-sm font-semibold text-verde-400 mb-2">
                  {candidate.name} te puede dar ({candidate.theyCanGive.length})
                </p>
                <StickerList codes={candidate.theyCanGive} color="green" />
              </div>

              <hr className="border-dark-500" />

              {/* I give them */}
              <div>
                <p className="text-sm font-semibold text-gold-400 mb-2">
                  Vos podés dar ({candidate.iCanGive.length})
                </p>
                <StickerList codes={candidate.iCanGive} color="gold" />
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onSwipe("left", candidate._id);
                  onClose();
                }}
                className="py-3 rounded-2xl border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold transition-colors"
              >
                Paso
              </button>
              <button
                onClick={() => {
                  onSwipe("right", candidate._id);
                  onClose();
                }}
                className="py-3 rounded-2xl bg-verde-500 text-white font-bold hover:bg-verde-400 transition-colors"
              >
                ¡Me sirve!
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
