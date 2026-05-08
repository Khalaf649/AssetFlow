"use client";

import Link from "next/link";
import { Laptop } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/app/auth/context/AuthContext";
import { useAssets } from "../hooks/useAssets";
import { useSpareLaptops } from "../hooks/useSpareLaptops";
import { AssetTable } from "./AssetTable";
import { getStatusBadgeStyles, formatStatus } from "./badges-utils";

export function DeveloperAssetView() {
  const { user } = useAuth();
  const { data, isLoading } = useAssets({
    page: 1,
    size: 100,
    assignedUserId: user?.id,
  });
  const { data: spareLaptops } = useSpareLaptops();

  const assets = data?.items || [];

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <Laptop className="h-6 w-6 text-accent" />
        <h1 className="text-2xl font-semibold text-foreground">My Equipment</h1>
        <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
          {assets.length}
        </span>
      </header>

      <AssetTable assets={assets} isLoading={isLoading} isStaff={false} />

      {/* Spare Laptops */}
      {spareLaptops && spareLaptops.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Spare Laptops Available</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {spareLaptops.map((a) => (
              <Link
                key={a.id}
                href={`/assets/${a.id}`}
                className="bg-card border border-border rounded-lg p-4 hover:border-accent/40 transition-colors"
              >
                <Laptop className="h-6 w-6 text-accent mb-2" />
                <p className="font-medium">{a.brand} {a.model}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">{a.serialNumber}</p>
                <Badge className={`mt-2 ${getStatusBadgeStyles(a.status)}`}>
                  {formatStatus(a.status)}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
