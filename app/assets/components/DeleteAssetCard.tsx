"use client";

import { useDeleteAsset } from "../hooks/useDeleteAsset";
import { Button } from "@/src/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteAssetCardProps {
  assetId: string;
  assetName: string;
  onDeleteSuccess: () => void;
}

export function DeleteAssetCard({ assetId, assetName, onDeleteSuccess }: DeleteAssetCardProps) {
  const { mutate: deleteAsset, isPending, isSuccess } = useDeleteAsset();

  const handleDelete = () => {
    deleteAsset(assetId, { onSuccess: onDeleteSuccess });
  };

  return (
    <div className="bg-card border border-destructive/30 rounded-lg p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-destructive/10 p-2">
          <Trash2 className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-destructive">Decommission Asset</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Permanently remove this asset from the inventory. This action cannot be undone.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground">
              Decommission
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Decommission Asset</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to decommission {assetName}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isPending ? "Decommissioning..." : "Decommission"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
