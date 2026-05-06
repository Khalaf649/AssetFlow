import { Boxes } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[linear-gradient(135deg,oklch(0.33_0.06_250)_0%,oklch(0.45_0.18_264)_100%)]">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8 text-primary-foreground">
          <Boxes className="h-7 w-7" />
          <span className="text-2xl font-semibold tracking-tight">
            AssetTrack
          </span>
        </div>
        <div className="bg-card text-card-foreground rounded-xl shadow-2xl border border-border p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
