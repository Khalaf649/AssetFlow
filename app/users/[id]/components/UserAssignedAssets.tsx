"use client";

import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { FileText } from "lucide-react";

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
    <Card className="bg-card border-border p-8 mb-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-accent" />
        Assigned Assets
      </h2>
      {assets && assets.length > 0 ? (
        <div className="space-y-3">
          {assets.map((asset: Asset) => (
            <div
              key={asset.id}
              className="p-4 bg-secondary/50 border border-border rounded-lg hover:bg-secondary/40"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{asset.brand}</p>
                  <p className="text-sm text-muted-foreground">{asset.model}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Serial: {asset.serialNumber}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-2">
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
        <p className="text-muted-foreground">No assets assigned</p>
      )}
    </Card>
  );
}
