"use client";

import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: string;
}

export function KpiCard({ label, value, icon: Icon, accent }: KpiCardProps) {
  return (
    <div
      className={`bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 ${accent}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            {label}
          </p>
          <p className="text-4xl font-bold text-foreground mt-2">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/50">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
