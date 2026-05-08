import { DashboardNavbar } from "@/app/dashboard/components/Navbar";

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardNavbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}