import { Boxes } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[linear-gradient(135deg,oklch(0.33_0.06_250)_0%,oklch(0.45_0.18_264)_100%)]">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-10 text-primary-foreground">
          <Boxes className="h-8 w-8" />
          <span className="text-3xl font-bold tracking-tight">AssetTrack</span>
        </div>
        <div className="bg-card/95 backdrop-blur-sm text-card-foreground rounded-2xl shadow-2xl border border-border p-8 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
