"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  assetFormSchema,
  assetTypeEnum,
  AssetFormInput,
  Asset,
} from "../schemas/asset-schemas";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useCreateAsset, useUpdateAsset } from "../hooks/useAssetMutations";

interface AssetFormModalProps {
  open: boolean;
  onClose: () => void;
  editAsset?: Asset | null;
}

const DEFAULT_VALUES: AssetFormInput = {
  brand: "",
  model: "",
  serialNumber: "",
  type: "LAPTOP",
  purchaseDate: "",
  warrantyExpirationDate: "",
};

export function AssetFormModal({
  open,
  onClose,
  editAsset,
}: AssetFormModalProps) {
  const isEdit = !!editAsset;

  const form = useForm<AssetFormInput>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    form.reset(
      editAsset
        ? {
            brand: editAsset.brand,
            model: editAsset.model,
            serialNumber: editAsset.serialNumber,
            type: editAsset.type,
            purchaseDate: editAsset.purchaseDate,
            warrantyExpirationDate: editAsset.warrantyExpirationDate,
          }
        : DEFAULT_VALUES,
    );
  }, [editAsset, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const { mutate: createAsset, isPending: isCreating } = useCreateAsset({
    setError: form.setError,
    onSuccess: handleClose,
  });

  const { mutate: updateAsset, isPending: isUpdating } = useUpdateAsset({
    setError: form.setError,
    onSuccess: handleClose,
  });

  const isPending = isCreating || isUpdating;

  const onSubmit = (data: AssetFormInput) => {
    if (isEdit && editAsset) {
      updateAsset({ id: editAsset.id, input: data });
    } else {
      createAsset(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Asset" : "Add New Asset"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Update the details for ${editAsset?.brand} ${editAsset?.model}`
              : "Register a new asset in the inventory"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Brand & Model */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Dell" {...field} />
                    </FormControl>
                    <FormDescription>
                      The manufacturer of the asset.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. XPS 15" {...field} />
                    </FormControl>
                    <FormDescription>
                      The specific model name or number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Serial Number & Type */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. SN123456789"
                        className="font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Found on the device label or box.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assetTypeEnum.options.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t.charAt(0) + t.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The category this asset belongs to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Purchase Date & Warranty Expiration */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      The date the asset was bought.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warrantyExpirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty Expiration</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      When the warranty coverage ends.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Root-level error */}
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
                {isPending
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                    ? "Update Asset"
                    : "Add Asset"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
