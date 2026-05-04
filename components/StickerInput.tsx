"use client";

import { useState } from "react";
import { Plus, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { findSticker, type StickerDef } from "@/lib/sticker-data";
import toast from "react-hot-toast";

interface Props {
  onAdd: (codes: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function StickerInput({
  onAdd,
  placeholder = "Ej: ARG1, BRA15, FWC3 o número 42",
  label = "Agregar figuritas",
  className,
}: Props) {
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState<StickerDef[]>([]);

  function handleChange(val: string) {
    setInput(val);
    if (!val.trim()) {
      setPreview([]);
      return;
    }
    const parts = val.split(/[\s,;\n]+/).filter(Boolean);
    const found: StickerDef[] = [];
    const seen = new Set<string>();
    for (const part of parts) {
      const s = findSticker(part);
      if (s && !seen.has(s.code)) {
        found.push(s);
        seen.add(s.code);
      }
    }
    setPreview(found);
  }

  function handleAdd() {
    if (preview.length === 0) {
      toast.error("No se encontraron figuritas con esos códigos");
      return;
    }
    onAdd(preview.map((s) => s.code));
    setInput("");
    setPreview([]);
    toast.success(`${preview.length} figurita${preview.length !== 1 ? "s" : ""} agregada${preview.length !== 1 ? "s" : ""}`);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            placeholder={placeholder}
            className="w-full pl-9 pr-4 py-2.5 bg-dark-700 border border-dark-500 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-400 text-sm"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={preview.length === 0}
          className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-black font-semibold rounded-xl transition-colors flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {preview.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-dark-700 rounded-xl">
          {preview.map((s) => (
            <span
              key={s.code}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-verde-600/30 border border-verde-500/40 rounded-full text-xs text-verde-400"
            >
              <span>{s.flag}</span>
              <span className="font-mono font-bold">{s.code}</span>
              <button
                onClick={() => {
                  const newPreview = preview.filter((p) => p.code !== s.code);
                  setPreview(newPreview);
                  if (newPreview.length === 0) setInput("");
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <span className="text-xs text-gray-400 self-center ml-1">
            {preview.length} figurita{preview.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
