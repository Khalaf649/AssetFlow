"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string | number;
}

export function DashboardCard({
  to,
  title,
  description,
  icon: Icon,
  badge,
}: DashboardCardProps) {
  return (
    <Link
      href={to}
      className="group bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-lg hover:border-accent/50 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="h-11 w-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent/20 transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        {badge !== undefined && (
          <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-foreground text-lg group-hover:text-accent transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mt-1.5">{description}</p>
    </Link>
  );
}
