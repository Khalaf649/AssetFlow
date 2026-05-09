'use client';

import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { SeverityBadge, ReportStatusBadge } from "./Badges";
import { ConditionReportResponse } from "../schemas/condition-report-schemas";

interface DeveloperReportsListProps {
  reports: ConditionReportResponse[];
  isLoading: boolean;
  error?: Error | null;
  onResolveClick?: (report: ConditionReportResponse) => void;
}

export function DeveloperReportsList({
  reports,
  isLoading,
  error,
  onResolveClick,
}: DeveloperReportsListProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
        Failed to load condition reports. Please try again.
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

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <p className="text-sm">No condition reports found.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/50">
          <TableRow className="hover:bg-secondary/40 border-border">
            <TableHead>Asset</TableHead>
            <TableHead>Reported By</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            {onResolveClick && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id} className="hover:bg-secondary/40 border-border">
              <TableCell className="font-medium">{report.assetId}</TableCell>
              <TableCell className="text-muted-foreground">{report.reportedBy.name}</TableCell>
              <TableCell className="text-muted-foreground max-w-xs truncate">{report.issue}</TableCell>
              <TableCell>
                <SeverityBadge severity={report.severity} />
              </TableCell>
              <TableCell>
                <ReportStatusBadge status={report.status} />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(report.createdAt).toISOString().slice(0, 10)}
              </TableCell>
              {onResolveClick && (
                <TableCell className="text-right">
                  {report.status !== 'RESOLVED' ? (
                    <Button variant="outline" size="sm" onClick={() => onResolveClick(report)}>
                      Resolve
                    </Button>
                  ) : null}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
