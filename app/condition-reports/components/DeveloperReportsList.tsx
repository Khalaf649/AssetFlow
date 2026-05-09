"use client";

import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Card } from "@/src/components/ui/card";
import {
  useConditionReports,
  useReportFilters,
} from "../hooks/useConditionReports";
import { SeverityBadge, ReportStatusBadge } from "./Badges";
import { ConditionReportResponse } from "../schemas/condition-report-schemas";

interface DeveloperReportsListProps {
  userId: string;
}

export function DeveloperReportsList({ userId }: DeveloperReportsListProps) {
  const { filters } = useReportFilters();
  const developerFilters = userId ? { ...filters, userId } : filters;
  const { data, isLoading, error } = useConditionReports(developerFilters);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
        Failed to load your reports. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <p className="text-sm">No condition reports submitted yet.</p>
        <p className="text-sm mt-1">
          Go to your assets to report any hardware issues.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-white border-b border-gray-200 hover:bg-white">
            <TableHead className="text-gray-600 font-semibold text-sm py-3">
              Asset
            </TableHead>
            <TableHead className="text-gray-600 font-semibold text-sm py-3">
              Issue
            </TableHead>
            <TableHead className="text-gray-600 font-semibold text-sm py-3">
              Severity
            </TableHead>
            <TableHead className="text-gray-600 font-semibold text-sm py-3">
              Status
            </TableHead>
            <TableHead className="text-gray-600 font-semibold text-sm py-3">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((report: ConditionReportResponse) => (
            <TableRow
              key={report.id}
              className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-semibold text-gray-900 py-4">
                {report.assetName ?? report.assetId}
              </TableCell>
              <TableCell className="text-gray-700 py-4 max-w-xs truncate">
                {report.issue}
              </TableCell>
              <TableCell className="py-4">
                <SeverityBadge severity={report.severity} />
              </TableCell>
              <TableCell className="py-4">
                <ReportStatusBadge status={report.status} />
              </TableCell>
              <TableCell className="text-gray-500 text-sm py-4">
                {new Date(report.createdAt).toISOString().slice(0, 10)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
