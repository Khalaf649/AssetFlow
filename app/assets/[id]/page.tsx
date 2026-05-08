"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/app/auth/context/AuthContext";
import { useAsset } from "../hooks/useAsset";
import { AssetDetailHeader } from "../components/AssetDetailHeader";
import { AssetInfoGrid } from "../components/AssetInfoGrid";
import { AllocationHistoryTable } from "../components/AllocationHistoryTable";
import { AssetConditionReports } from "../components/AssetConditionReports";
import { DeleteAssetCard } from "../components/DeleteAssetCard";
import { AssetFormModal } from "../components/AssetFormModal";
import { AllocationModal } from "../components/AllocationModal";
import type { Asset } from "../schemas/asset-schemas";

interface AssetPageProps {
  params: { id: string };
}

export default function AssetPage({ params }: AssetPageProps) {
  const assetId = params.id;
  const router = useRouter();
  const { user } = useAuth();
  const { data: asset, isLoading } = useAsset(assetId);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);

  const mockUser = { id: "dev-user-1", name: "Developer User", role: "ADMIN" as const };
  const currentUser = user || mockUser;
  const isStaff = currentUser.role === "ADMIN" || currentUser.role === "MANAGER";
  const isAdmin = currentUser.role === "ADMIN";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Loading asset details...</p>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Asset not found.</p>
        <Link href="/assets" className="text-accent hover:underline text-sm mt-2 inline-block">
          Back to inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/assets"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to assets
      </Link>

      {/* Header + Info Grid */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <AssetDetailHeader
          asset={asset}
          isStaff={isStaff}
          onEditClick={() => setShowEditModal(true)}
          onAllocateClick={() => setShowAllocationModal(true)}
        />
        <AssetInfoGrid asset={asset} />
      </div>

      {/* Allocation History — ADMIN/MANAGER only */}
      {isStaff && <AllocationHistoryTable assetId={assetId} />}

      {/* Condition Reports */}
      <AssetConditionReports reports={asset.conditionReports || []} />

      {/* Delete Card — ADMIN only */}
      {isAdmin && (
        <DeleteAssetCard
          assetId={assetId}
          assetName={`${asset.brand} ${asset.model}`}
          onDeleteSuccess={() => router.push("/assets")}
        />
      )}

      {/* Modals */}
      <AssetFormModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        editAsset={asset}
      />
      <AllocationModal
        open={showAllocationModal}
        onClose={() => setShowAllocationModal(false)}
        asset={asset}
      />
    </div>
  );
}
