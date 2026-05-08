'use client';

import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { Card } from '@/src/components/ui/card';
import { useConditionReports, useReportFilters } from '../hooks/useConditionReports';
import { SeverityBadge, ReportStatusBadge } from './Badges';
import { ConditionReportResponse } from '../schemas/condition-report-schemas';

interface DeveloperReportsListProps {
  userId: string;
}

/**
 * DeveloperReportsList - Shows the developer's own condition reports
 * Limited to read-only view - no editing capabilities
 */
export function DeveloperReportsList({ userId }: DeveloperReportsListProps) {
  const { filters } = useReportFilters();
  // Filter to only show reports from this user
  const developerFilters = userId ? { ...filters, userId } : filters;
  const { data, isLoading, error } = useConditionReports(developerFilters);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
        Failed to load your reports. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <Card className="p-8 text-center text-gray-500 dark:text-gray-400">
        <p>No condition reports submitted yet.</p>
        <p className="text-sm mt-2">Go to your assets to report any hardware issues.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-900">
          <TableRow>
            <TableHead>Asset ID</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((report: ConditionReportResponse) => (
            <TableRow
              key={report.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <TableCell className="font-medium text-blue-600 dark:text-blue-400">
                {report.assetId}
              </TableCell>
              <TableCell className="max-w-xs truncate text-gray-700 dark:text-gray-300">
                {report.issue}
              </TableCell>
              <TableCell>
                <SeverityBadge severity={report.severity} />
              </TableCell>
              <TableCell>
                <ReportStatusBadge status={report.status} />
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                {new Date(report.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
