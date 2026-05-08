"use client";

import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";

interface Asset {
  id: string;
  brand: string;
  model: string;
  serialNumber: string;
  type: "LAPTOP" | "MONITOR" | "ACCESSORY";
  status: "AVAILABLE" | "ASSIGNED" | "UNDER_REPAIR" | "DECOMMISSIONED";
}

interface UserAssignedAssetsProps {
  assets?: Asset[];
}

export function UserAssignedAssets({ assets = [] }: UserAssignedAssetsProps) {
  return (
    <Card className="bg-card border-border p-6 h-full">
      <h2 className="text-base font-semibold mb-4">
        Assigned Assets ({assets.length})
      </h2>
      {assets.length > 0 ? (
        <div className="space-y-3">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="p-4 bg-secondary/40 border border-border rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{asset.brand}</p>
                  <p className="text-sm text-muted-foreground">{asset.model}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Serial: {asset.serialNumber}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant="outline" className="text-xs">
                    {asset.type}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Status: {asset.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No assets currently assigned.
        </p>
      )}
    </Card>
  );
}
