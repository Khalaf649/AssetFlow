"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { allocationSchema, AllocationInput, Asset } from "../schemas/asset-schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { useAssignAsset, useReturnAsset } from "../hooks/useAllocations";

interface AllocationModalProps {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
}

export function AllocationModal({
  open,
  onClose,
  asset,
}: AllocationModalProps) {
  const isAssigned = asset?.status === "ASSIGNED";

  const form = useForm<AllocationInput>({
    resolver: zodResolver(allocationSchema),
    defaultValues: { userId: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({ userId: "" });
    }
  }, [open, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const { mutate: assignAsset, isPending: isAssigning } = useAssignAsset({
    assetId: asset?.id || "",
    setError: form.setError,
    onSuccess: handleClose,
  });

  const { mutate: returnAsset, isPending: isReturning } = useReturnAsset({
    assetId: asset?.id || "",
    setError: form.setError,
    onSuccess: handleClose,
  });

  const isPending = isAssigning || isReturning;

  const handleAssign = (data: AllocationInput) => {
    assignAsset(data);
  };

  const handleReturn = () => {
    returnAsset();
  };

  if (!asset) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isAssigned ? "Return Asset" : "Assign Asset"}
          </DialogTitle>
          <DialogDescription>
            {isAssigned
              ? `Return ${asset.brand} ${asset.model} from ${asset.assignedTo?.name || "the current user"}`
              : `Assign ${asset.brand} ${asset.model} to a user`}
          </DialogDescription>
        </DialogHeader>

        {isAssigned ? (
          /* Return Flow */
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will unassign the asset and mark it as available.
            </p>

            {form.formState.errors.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleReturn} disabled={isPending}>
                {isReturning ? "Returning..." : "Return Asset"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* Assign Flow */
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAssign)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter user ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isAssigning ? "Assigning..." : "Assign Asset"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
