"use client";

import Link from "next/link";
import { Calendar, Hash } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { getStatusBadgeStyles, formatStatus } from "./badges-utils";
import type { Asset } from "../schemas/asset-schemas";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{label}</p>
      <p className="text-sm text-foreground mt-1">{value}</p>
    </div>
  );
}

interface AssetInfoGridProps {
  asset: Asset;
}

export function AssetInfoGrid({ asset }: AssetInfoGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
      <InfoRow label="Type" value={asset.type} />
      <InfoRow label="Brand" value={asset.brand} />
      <InfoRow label="Model" value={asset.model} />
      <InfoRow
        label="Serial"
        value={<span className="font-mono"><Hash className="h-3 w-3 inline" />{asset.serialNumber}</span>}
      />
      <InfoRow
        label="Purchase Date"
        value={<><Calendar className="h-3 w-3 inline mr-1" />{asset.purchaseDate}</>}
      />
      <InfoRow label="Warranty Expiry" value={asset.warrantyExpirationDate} />
      <InfoRow
        label="Status"
        value={<Badge className={getStatusBadgeStyles(asset.status)}>{formatStatus(asset.status)}</Badge>}
      />
      <InfoRow
        label="Assigned To"
        value={
          asset.assignedTo ? (
            <Link href={`/users/${asset.assignedTo.id}`} className="text-accent hover:underline">
              {asset.assignedTo.name}
            </Link>
          ) : (
            <span className="text-muted-foreground">Unassigned</span>
          )
        }
      />
    </div>
  );
}
