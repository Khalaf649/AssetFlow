'use client';

import { Loader2 } from 'lucide-react';
import { useDashboardStats } from '../hooks/useDashboardStats';

function BreakdownBar({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
          {label}
        </span>
        <span className="text-sm font-medium text-gray-700">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-5 text-sm font-semibold text-gray-800">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function DashboardStatsPanel() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Failed to load dashboard statistics. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionCard title="Assets by Type">
        {Object.entries(data.byType).map(([type, count]) => (
          <BreakdownBar key={type} label={type} value={count} total={data.totalAssets} />
        ))}
      </SectionCard>

      <SectionCard title="Assets by Status">
        {Object.entries(data.byStatus).map(([status, count]) => (
          <BreakdownBar key={status} label={status} value={count} total={data.totalAssets} />
        ))}
      </SectionCard>
    </div>
  );
}