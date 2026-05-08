"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useAssetFilters } from "../hooks/useAssetFilters";
import { useAssets } from "../hooks/useAssets";
import { useDeleteAsset } from "../hooks/useDeleteAsset";
import { AssetFilterBar } from "./AssetFilterBar";
import { AssetTable } from "./AssetTable";
import { AssetFormModal } from "./AssetFormModal";
import { useAuth } from "@/app/auth/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import type { Asset } from "../schemas/asset-schemas";

export function AdminAssetView() {
  const { user } = useAuth();
  const { filters, setFilter } = useAssetFilters();
  const { data, isLoading } = useAssets(filters);
  const [showForm, setShowForm] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);

  const { mutate: deleteAsset, isPending: isDeleting } = useDeleteAsset();

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";
  const assets = data?.items || [];
  const totalElements = data?.pagination?.totalElements || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteAsset(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

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
        onDeleteClick={isAdmin ? (a) => setDeleteTarget(a) : undefined}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page <= 1}
            onClick={() => setFilter("page", filters.page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {filters.page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page >= totalPages}
            onClick={() => setFilter("page", filters.page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <AssetFormModal
        open={showForm}
        onClose={() => { setShowForm(false); setEditAsset(null); }}
        editAsset={editAsset}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decommission Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to decommission {deleteTarget?.brand} {deleteTarget?.model}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Decommissioning..." : "Decommission"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
