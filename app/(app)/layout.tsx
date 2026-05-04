import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      {/* pt-14 for top bar, pb-16 for bottom nav */}
      <main className="pt-14 pb-16 max-w-md mx-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
