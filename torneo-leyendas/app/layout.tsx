import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "El Torneo de las Leyendas — Coming soon",
  description:
    "A, B, Los Papus, Tercero, Auxi y Matadores. Seis equipos, una sola copa. Muy pronto.",
};

export const viewport: Viewport = { themeColor: "#06210f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${anton.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
