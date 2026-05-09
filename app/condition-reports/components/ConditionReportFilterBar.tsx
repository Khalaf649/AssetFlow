'use client';

import { useState, type KeyboardEvent } from 'react';
import { Search, ClipboardList, X } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { FilterReportInput } from '../schemas/condition-report-schemas';

interface ConditionReportFilterBarProps {
  totalElements: number;
  filters: Pick<FilterReportInput, 'status' | 'severity' | 'assetId'>;
  setFilter: <K extends keyof FilterReportInput>(
    key: K,
    value: FilterReportInput[K],
  ) => void;
  showAssetFilter?: boolean;
}

export function ConditionReportFilterBar({
  totalElements,
  filters,
  setFilter,
  showAssetFilter = false,
}: ConditionReportFilterBarProps) {
  const [assetIdInput, setAssetIdInput] = useState(filters.assetId || '');

  const commitAssetFilter = () => {
    setFilter('assetId', assetIdInput || undefined);
  };

  const handleAssetKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      commitAssetFilter();
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-semibold text-foreground">
            Condition Reports
          </h1>
          <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
            {totalElements}
          </span>
        </div>
      </header>

      <div className="flex flex-wrap gap-3 items-center">
        {showAssetFilter && (
          <div className="relative flex-1 min-w-60">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by asset ID"
              value={assetIdInput}
              onChange={(event) => setAssetIdInput(event.target.value)}
              onBlur={commitAssetFilter}
              onKeyDown={handleAssetKeyDown}
              className="pl-9 pr-9"
            />
            {assetIdInput && (
              <button
                type="button"
                onClick={() => {
                  setAssetIdInput('');
                  setFilter('assetId', undefined);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                title="Clear asset filter"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        <Select
          value={filters.status || ''}
          onValueChange={(value) => {
            if (value === 'ALL') {
              setFilter('status', undefined);
            } else {
              setFilter('status', value as FilterReportInput['status']);
            }
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.severity || ''}
          onValueChange={(value) => {
            if (value === 'ALL') {
              setFilter('severity', undefined);
            } else {
              setFilter('severity', value as FilterReportInput['severity']);
            }
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Severities</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}