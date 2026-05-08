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

      {/* Date Range Filter */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">From</label>
          <input
            type="date"
            defaultValue={searchParams.get('from') ?? ''}
            onChange={(e) => setDateParam('from', e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">To</label>
          <input
            type="date"
            defaultValue={searchParams.get('to') ?? ''}
            onChange={(e) => setDateParam('to', e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load usage data.
        </div>
      )}

      {data && (
        <div className="space-y-5">

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Allocations
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{data.totalAllocations}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Avg. Duration
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {data.averageAllocationDays}
                <span className="text-base font-normal text-gray-400"> days</span>
              </p>
            </div>
          </div>

          {/* Top Users */}
          {data.topUsers.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-5 text-sm font-semibold text-gray-800">Top Users</h3>
              <div className="space-y-4">
                {data.topUsers.map((user, i) => {
                  const max = data.topUsers[0].allocations;
                  const pct = max > 0 ? (user.allocations / max) * 100 : 0;
                  return (
                    <div key={user.userId} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">#{i + 1}</span>
                          <span className="text-sm font-medium text-gray-700">{user.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{user.allocations}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Condition Reports by Month */}
          {data.conditionReportsByMonth.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-5 text-sm font-semibold text-gray-800">
                Condition Reports by Month
              </h3>
              <div className="flex items-end gap-2 h-40">
                {data.conditionReportsByMonth.map((entry) => {
                  const max = Math.max(...data.conditionReportsByMonth.map((e) => e.count));
                  const pct = max > 0 ? (entry.count / max) * 100 : 0;
                  return (
                    <div key={entry.month} className="flex flex-1 flex-col items-center gap-1 group">
                      <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {entry.count}
                      </span>
                      <div
                        className="w-full min-h-[4px] rounded-t bg-blue-200 hover:bg-blue-600 transition-all cursor-default"
                        style={{ height: `${Math.max(pct, 5)}%` }}
                        title={`${entry.month}: ${entry.count}`}
                      />
                      <span className="text-xs text-gray-400">{entry.month.slice(0, 3)}</span>
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