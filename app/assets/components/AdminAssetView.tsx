"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useAssetFilters } from "../hooks/useAssetFilters";
import { useAssets } from "../hooks/useAssets";
import { AssetFilterBar } from "./AssetFilterBar";
import { AssetTable } from "./AssetTable";
import { AssetFormModal } from "./AssetFormModal";
import { useAuth } from "@/app/auth/context/AuthContext";
import type { Asset } from "../schemas/asset-schemas";

export function AdminAssetView() {
  const { user } = useAuth();
  const { filters, setFilter } = useAssetFilters();
  const { data, isLoading } = useAssets(filters);
  const [showForm, setShowForm] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);

  const isAdmin = user?.role === "ADMIN";
  const assets = data?.items || [];
  const totalElements = data?.pagination?.totalElements || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <AssetFilterBar
          totalElements={totalElements}
          filters={filters}
          setFilter={setFilter}
        />
        <Button onClick={() => { setEditAsset(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />Add Asset
        </Button>
      </div>

      <AssetTable
        assets={assets}
        isLoading={isLoading}
        isStaff={true}
        onEditClick={(a) => { setEditAsset(a); setShowForm(true); }}
        onDeleteClick={isAdmin ? undefined : undefined}
      />

      <AssetFormModal
        open={showForm}
        onClose={() => { setShowForm(false); setEditAsset(null); }}
        editAsset={editAsset}
      />
    </div>
  );
}
