import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import type { Asset } from "../../schemas/users-schemas";

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
            <Link key={asset.id} href={`/assets/${asset.id}`} className="block">
              <div className="p-4 bg-secondary/40 border border-border rounded-lg hover:bg-secondary/80 hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {asset.brand}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {asset.model}
                    </p>
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
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg border-border">
          No assets currently assigned.
        </p>
      )}
    </Card>
  );
}
