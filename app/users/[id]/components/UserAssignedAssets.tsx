import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import type { Asset } from "../../schemas/users-schemas";

interface UserAssignedAssetsProps {
  assets?: Asset[];
  isLoading?: boolean;
}

export function UserAssignedAssets({
  assets = [],
  isLoading = false,
}: UserAssignedAssetsProps) {
  return (
    <Card className="bg-card border-border p-6 h-full">
      <h2 className="text-base font-semibold mb-4">
        Assigned Assets ({assets.length})
      </h2>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-4 bg-secondary/40 border border-border rounded-lg animate-pulse"
            >
              <div className="h-4 bg-muted rounded w-1/3 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2 mb-2" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : assets.length > 0 ? (
        <div className="space-y-3">
          {assets.map((asset) => (
            <Link key={asset.id} href={`/assets/${asset.id}`} className="block">
              <div className="p-4 bg-secondary/40 border border-border rounded-lg hover:bg-secondary/80 hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-sm text-foreground">
                      {asset.brand}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {asset.model}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Serial: {asset.serialNumber}
                    </div>
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
