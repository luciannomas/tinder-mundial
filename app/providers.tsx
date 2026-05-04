"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1A1A26",
            color: "#fff",
            border: "1px solid #2A2A4A",
            borderRadius: "12px",
          },
          success: {
            iconTheme: { primary: "#00C851", secondary: "#000" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#000" },
          },
        }}
      />
    </SessionProvider>
  );
}
