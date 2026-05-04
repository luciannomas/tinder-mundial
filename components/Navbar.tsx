"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Trophy, Grid, Heart, MessageCircle, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/album", icon: Grid, label: "Álbum" },
  { href: "/match", icon: Heart, label: "Match" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-800/90 backdrop-blur border-b border-dark-600">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/match" className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-gold-400" />
            <span className="font-bold text-lg text-white tracking-wide">
              Figu<span className="text-gold-400">Swap</span>
            </span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-800/90 backdrop-blur border-t border-dark-600">
        <div className="max-w-md mx-auto flex">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors",
                  active ? "text-gold-400" : "text-gray-500 hover:text-gray-300"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
