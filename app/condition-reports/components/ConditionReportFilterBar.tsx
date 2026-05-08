'use client';

import { Button } from '@/src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { X } from 'lucide-react';
import { ReportStatus, Severity } from '../schemas/condition-report-schemas';
import { useReportFilters } from '../hooks/useConditionReports';

/**
 * ConditionReportFilterBar - URL-based filter controls for the reports list
 * Allows filtering by status, severity, and assetId
 */
export function ConditionReportFilterBar() {
  const { filters, setFilter, resetFilters } = useReportFilters();

  const hasActiveFilters = filters.status || filters.severity || filters.assetId;

  const statuses: ReportStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
  const severities: Severity[] = ['LOW', 'MEDIUM', 'HIGH'];

  return (
    <div className="flex flex-wrap gap-3 items-end">
      {/* Status Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <Select
          value={filters.status || ''}
          onValueChange={(value) =>
            setFilter({ status: (value || undefined) as ReportStatus | undefined, page: 0 })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Severity Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Severity
        </label>
        <Select
          value={filters.severity || ''}
          onValueChange={(value) =>
            setFilter({ severity: (value || undefined) as Severity | undefined, page: 0 })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All severities</SelectItem>
            {severities.map((severity) => (
              <SelectItem key={severity} value={severity}>
                {severity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
