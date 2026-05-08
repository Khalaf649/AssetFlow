'use client';

import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUsageReport } from '../hooks/useUsageReport';

export function UsageReportView() {
  const { data, isLoading, error } = useUsageReport();
  const router = useRouter();
  const searchParams = useSearchParams();

  const setDateParam = (key: 'from' | 'to', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Date Range Filter — FR-R03 */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">From</label>
          <input
            type="date"
            defaultValue={searchParams.get('from') ?? ''}
            onChange={(e) => setDateParam('from', e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">To</label>
          <input
            type="date"
            defaultValue={searchParams.get('to') ?? ''}
            onChange={(e) => setDateParam('to', e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          Failed to load usage data.
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Total Allocations</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{data.totalAllocations}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Avg. Duration</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {data.averageAllocationDays}
                <span className="text-base font-normal text-muted-foreground"> days</span>
              </p>
            </div>
          </div>

          {/* Top Users */}
          {data.topUsers.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Top Users
              </h3>
              <div className="space-y-3">
                {data.topUsers.map((user, i) => {
                  const max = data.topUsers[0].allocations;
                  const pct = max > 0 ? (user.allocations / max) * 100 : 0;
                  return (
                    <div key={user.userId} className="flex items-center gap-4">
                      <span className="w-5 text-xs text-muted-foreground">#{i + 1}</span>
                      <span className="w-36 truncate text-sm text-foreground">{user.name}</span>
                      <div className="flex-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-12 text-right text-sm font-medium text-foreground">{user.allocations}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Condition Reports by Month Chart — FR-R03 */}
          {data.conditionReportsByMonth.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Condition Reports by Month
              </h3>
              <div className="flex items-end gap-2 h-40">
                {data.conditionReportsByMonth.map((entry) => {
                  const max = Math.max(...data.conditionReportsByMonth.map((e) => e.count));
                  const pct = max > 0 ? (entry.count / max) * 100 : 0;
                  return (
                    <div key={entry.month} className="flex flex-1 flex-col items-center gap-1 group">
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {entry.count}
                      </span>
                      <div
                        className="w-full min-h-[4px] rounded-t bg-primary/60 hover:bg-primary transition-all cursor-default"
                        style={{ height: `${Math.max(pct, 5)}%` }}
                        title={`${entry.month}: ${entry.count}`}
                      />
                      <span className="text-xs text-muted-foreground">{entry.month.slice(0, 3)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}