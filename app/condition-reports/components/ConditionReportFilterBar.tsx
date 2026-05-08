'use client';

import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Search, X } from 'lucide-react';
import { useReportFilters } from '../hooks/useConditionReports';

export function ConditionReportFilterBar() {
  const { filters, setFilter, resetFilters } = useReportFilters();

  const hasActiveSearch = !!filters.assetId;

  return (
    <div className="flex items-center gap-2 w-full max-w-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by asset name..."
          value={filters.assetId || ''}
          onChange={(e) => setFilter({ assetId: e.target.value || undefined, page: 0 })}
          className="pl-9 pr-9 bg-white border-gray-200 rounded-md text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500"
        />
        {hasActiveSearch && (
          <button
            onClick={resetFilters}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}