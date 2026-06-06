import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden pb-24 md:pb-0">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-8 md:px-10">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
