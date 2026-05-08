import type { AssetStatus } from "../schemas/asset-schemas";

export function getStatusBadgeStyles(status: AssetStatus | string) {
  switch (status) {
    case "AVAILABLE":
      return "bg-success/15 text-success border border-success/30 font-medium";
    case "ASSIGNED":
      return "bg-accent/15 text-accent border border-accent/30 font-medium";
    case "UNDER_REPAIR":
      return "bg-warning/20 text-warning-foreground border border-warning/40 font-medium";
    case "DECOMMISSIONED":
      return "bg-muted text-muted-foreground border border-border font-medium";
    default:
      return "bg-muted text-muted-foreground border border-border font-medium";
  }
}

export function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

export function daysUntil(dateStr: string): number {
  const ms = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function getWarrantyColorClass(days: number): string {
  if (days < 30) return "text-destructive";
  if (days < 90) return "text-warning-foreground";
  return "text-muted-foreground";
}
