'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/context/AuthContext";
import { useAssets } from "@/app/assets/hooks/useAssets";
import { ReportIssueForm } from "../components/ReportIssueForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Card } from "@/src/components/ui/card";
import { Loader2 } from "lucide-react";

export default function NewConditionReportPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");

  if (!user) return null;

  const { data: assetsResponse, isLoading, error } = useAssets({
    page: 1,
    size: 100,
    assignedUserId: user.id,
  });

  const assets = assetsResponse?.items || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">Error loading assets: {(error as Error).message}</p>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Report a New Issue</h1>
          <p>You have no assigned assets to report issues on.</p>
        </Card>
      </div>
    );
  }

  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId);

  return (
    <div className="p-6">
      <Card className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Report a New Issue</h1>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Asset</label>
          <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an asset to report an issue on" />
            </SelectTrigger>
            <SelectContent>
              {assets.map((asset) => (
                <SelectItem key={asset.id} value={asset.id}>
                  {asset.brand} {asset.model} ({asset.serialNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedAsset && (
          <ReportIssueForm
            assetId={selectedAsset.id}
            assetName={`${selectedAsset.brand} ${selectedAsset.model}`}
            onSuccess={() => router.push("/condition-reports")}
          />
        )}
      </Card>
    </div>
  );
}
