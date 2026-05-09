"use client";

import { ShieldCheck } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { getStatusBadgeStyles, formatStatus, daysUntil } from "./badges-utils";
import type { Asset } from "../schemas/asset-schemas";

interface AssetDetailHeaderProps {
  asset: Asset;
  isStaff: boolean;
  onReportClick: () => void;
  onEditClick: () => void;
  onAllocateClick: () => void;
}

export function AssetDetailHeader({
  asset,
  isStaff,
  onReportClick,
  onEditClick,
  onAllocateClick,
}: AssetDetailHeaderProps) {
  const days = daysUntil(asset.warrantyExpirationDate);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold">
              {asset.brand} {asset.model}
            </h1>
            <Badge className={getStatusBadgeStyles(asset.status)}>
              {formatStatus(asset.status)}
            </Badge>
            <span
              className={`text-xs px-2 py-1 rounded-full border ${days < 30 ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-border bg-secondary text-muted-foreground"}`}
            >
              <ShieldCheck className="h-3 w-3 inline mr-1" />
              {days > 0 ? `Warranty: ${days}d left` : "Out of warranty"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            {asset.serialNumber}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onReportClick}>
            Submit Condition Report
          </Button>
          {isStaff && (
            <>
              <Button variant="outline" onClick={onEditClick}>
                Edit
              </Button>
              <Button onClick={onAllocateClick}>
                {asset.status === "ASSIGNED" ? "Return" : "Allocate"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
