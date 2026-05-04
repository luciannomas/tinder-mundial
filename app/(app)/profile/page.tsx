"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MapPin, User, Save, Locate } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [stats, setStats] = useState({ have: 0, need: 0, pasted: 0 });

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
    fetch("/api/user/stickers")
      .then((r) => r.json())
      .then((d) => {
        setStats({
          have: d.stickersHave?.length ?? 0,
          need: d.stickersNeed?.length ?? 0,
          pasted: d.stickersPasted?.length ?? 0,
        });
      });
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.city) setCity(d.user.city);
        if (d.user?.name) setName(d.user.name);
      });
  }, [session]);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, city }),
    });
    setSaving(false);
    if (res.ok) {
      await update({ name });
      toast.success("Perfil actualizado");
    } else {
      toast.error("Error al guardar");
    }
  }

  async function handleLocate() {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const res = await fetch("/api/user/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        });
        setLocating(false);
        if (res.ok) {
          toast.success("Ubicación actualizada");
        } else {
          toast.error("Error al guardar ubicación");
        }
      },
      () => {
        setLocating(false);
        toast.error("No se pudo obtener tu ubicación");
      }
    );
  }

  return (
    <div className="p-4 space-y-5">
      <div className="flex items-center gap-2">
        <User className="w-6 h-6 text-gold-400" />
        <h1 className="text-xl font-bold text-white">Mi Perfil</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center py-4">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? ""}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full border-4 border-gold-400 object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-dark-700 border-4 border-gold-400 flex items-center justify-center">
            <span className="text-3xl font-bold text-gold-400">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <p className="text-gray-400 text-sm mt-2">{session?.user?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Pegadas", value: stats.pasted, color: "text-verde-400" },
          { label: "Repetidas", value: stats.have, color: "text-gold-400" },
          { label: "Faltan", value: stats.need, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="bg-dark-800 border border-dark-600 rounded-2xl p-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 space-y-4">
        <h2 className="font-semibold text-white">Editar datos</h2>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-dark-700 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-gold-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Ciudad</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Buenos Aires"
              className="flex-1 px-4 py-2.5 bg-dark-700 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-gold-400 placeholder-gray-500"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      {/* Location */}
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4">
        <h2 className="font-semibold text-white mb-3">Geolocalización</h2>
        <p className="text-sm text-gray-400 mb-3">
          Activá tu ubicación para encontrar coleccionistas cerca tuyo y aparecer
          ordenado por distancia.
        </p>
        <button
          onClick={handleLocate}
          disabled={locating}
          className="w-full py-2.5 border border-verde-500 text-verde-400 hover:bg-verde-500 hover:text-white disabled:opacity-60 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Locate className="w-4 h-4" />
          {locating ? "Obteniendo ubicación..." : "Actualizar mi ubicación"}
        </button>
      </div>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full py-2.5 border border-red-500/50 text-red-400 hover:bg-red-500/10 font-semibold rounded-xl transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
