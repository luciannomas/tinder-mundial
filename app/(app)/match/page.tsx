"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import SwipeCard, { SwipeActions, type Candidate } from "@/components/SwipeCard";
import MatchDetailModal from "@/components/MatchDetailModal";
import { Heart, RefreshCw, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function MatchPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Candidate | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/matches");
    if (res.ok) {
      const data = await res.json();
      setCandidates(data.candidates);
      setCurrentIndex(0);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  async function handleSwipe(direction: "right" | "left", candidateId: string) {
    const res = await fetch(`/api/matches/${candidateId}/swipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId: candidateId, direction }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.matched) {
        toast.success("¡Match confirmado! Ya podés chatear 🎉", { duration: 4000 });
        setTimeout(() => router.push(`/chat/${data.matchId}`), 1500);
      }
    }

    setCurrentIndex((i) => i + 1);
  }

  const currentCandidate = candidates[currentIndex];
  const nextCandidate = candidates[currentIndex + 1];
  const hasMore = currentIndex < candidates.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-7rem)]">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-gold-400" />
          <h1 className="text-xl font-bold text-white">Matches</h1>
        </div>
        <button
          onClick={fetchCandidates}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Actualizar"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {!hasMore ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center mb-2">
            <Users className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-xl font-bold text-white">Sin más candidatos</h2>
          <p className="text-gray-400 max-w-xs text-sm">
            Ya revisaste todos los usuarios disponibles. Volvé más tarde o cargá más
            figuritas para encontrar nuevos matches.
          </p>
          <button
            onClick={fetchCandidates}
            className="px-6 py-3 bg-gold-500 text-black font-bold rounded-xl hover:bg-gold-400 transition-colors"
          >
            Actualizar
          </button>
        </div>
      ) : (
        <>
          {/* Card stack */}
          <div className="flex-1 relative mx-auto w-full max-w-sm">
            <AnimatePresence>
              {nextCandidate && (
                <SwipeCard
                  key={nextCandidate._id + "-next"}
                  candidate={nextCandidate}
                  onSwipe={handleSwipe}
                  onShowDetail={setDetail}
                  isTop={false}
                />
              )}
              {currentCandidate && (
                <SwipeCard
                  key={currentCandidate._id}
                  candidate={currentCandidate}
                  onSwipe={handleSwipe}
                  onShowDetail={setDetail}
                  isTop={true}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Action buttons */}
          <div className="py-4">
            <SwipeActions
              onLeft={() => currentCandidate && handleSwipe("left", currentCandidate._id)}
              onRight={() => currentCandidate && handleSwipe("right", currentCandidate._id)}
            />
            <p className="text-center text-xs text-gray-500 mt-3">
              {candidates.length - currentIndex} candidato{candidates.length - currentIndex !== 1 ? "s" : ""} restante{candidates.length - currentIndex !== 1 ? "s" : ""}
            </p>
          </div>
        </>
      )}

      <MatchDetailModal
        candidate={detail}
        onClose={() => setDetail(null)}
        onSwipe={(dir, id) => {
          handleSwipe(dir, id);
          setDetail(null);
        }}
      />
    </div>
  );
}
