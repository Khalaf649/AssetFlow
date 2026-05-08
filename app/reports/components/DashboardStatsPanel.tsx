'use client';

import { Loader2 } from 'lucide-react';
import { useDashboardStats } from '../hooks/useDashboardStats';

function StatCard({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' : 'border-border bg-card'}`}>
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}

function BreakdownBar({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 text-sm text-muted-foreground capitalize">{label.toLowerCase()}</span>
      <div className="flex-1 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function DashboardStatsPanel() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        Failed to load dashboard statistics. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard label="Total Assets" value={data.totalAssets} />
        <StatCard label="Open Reports" value={data.openConditionReports} accent />
        <StatCard label="Warranty Expiring (30d)" value={data.warrantyExpiringIn30Days} accent />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">By Type</h3>
          <div className="space-y-3">
            {Object.entries(data.byType).map(([type, count]) => (
              <BreakdownBar key={type} label={type} value={count} total={data.totalAssets} />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">By Status</h3>
          <div className="space-y-3">
            {Object.entries(data.byStatus).map(([status, count]) => (
              <BreakdownBar key={status} label={status} value={count} total={data.totalAssets} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}