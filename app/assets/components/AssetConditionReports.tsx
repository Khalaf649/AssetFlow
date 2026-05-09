"use client";

import { Badge } from "@/src/components/ui/badge";
import type { ConditionReport } from "../schemas/asset-schemas";

function getSeverityStyles(severity: string) {
  switch (severity) {
    case "LOW":
      return "bg-success/15 text-success border border-success/30 font-medium";
    case "MEDIUM":
      return "bg-warning/20 text-warning-foreground border border-warning/40 font-medium";
    case "HIGH":
      return "bg-destructive/15 text-destructive border border-destructive/30 font-medium";
    default:
      return "bg-muted text-muted-foreground border border-border font-medium";
  }
}

function getReportStatusStyles(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-destructive/15 text-destructive border border-destructive/30 font-medium";
    case "IN_PROGRESS":
      return "bg-warning/20 text-warning-foreground border border-warning/40 font-medium";
    case "RESOLVED":
      return "bg-success/15 text-success border border-success/30 font-medium";
    default:
      return "bg-muted text-muted-foreground border border-border font-medium";
  }
}

interface AssetConditionReportsProps {
  reports: ConditionReport[];
}

export function AssetConditionReports({ reports }: AssetConditionReportsProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="font-semibold mb-4">
        Condition Reports ({reports.length})
      </h2>
      {reports.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No reports filed for this asset.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {reports.map((r) => (
            <li
              key={r.id}
              className="py-4 flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <p className="text-sm text-foreground">{r.issue}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Reported by {r.reportedBy.name} · {r.createdAt}
                </p>
              </div>
              <div className="flex flex-row gap-3 items-end">
                <Badge className={getSeverityStyles(r.severity)}>
                  {r.severity}
                </Badge>
                <Badge className={getReportStatusStyles(r.status)}>
                  {r.status.replace(/_/g, " ")}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
