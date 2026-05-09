"use client";

import { useEffect, useState } from "react";
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
import { fetchUsers } from "@/app/users/api/users-api";
import { useAuth } from "@/app/auth/context/AuthContext";
import { useQuery } from "@tanstack/react-query";

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

  // Search state for selecting user to assign
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const usersQuery = useQuery({
    queryKey: ["users", "search", debouncedSearch],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      return fetchUsers(token, { page: 1, size: 6, q: debouncedSearch });
    },
    enabled: !!token && debouncedSearch.length > 0,
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
        {/* Search users UX at the top */}
        {!isAssigned && (
          <div className="mb-4">
            <label className="text-sm font-medium">Search user</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or id"
              className="w-full mt-1 p-2 border rounded"
            />

            {usersQuery.isFetching && (
              <p className="text-sm text-muted-foreground mt-2">Searching...</p>
            )}

            {usersQuery.data?.items?.length ? (
              <ul className="mt-2 max-h-40 overflow-auto border rounded bg-white">
                {usersQuery.data.items.map((u) => (
                  <li
                    key={u.id}
                    className="p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      form.setValue("userId", u.id);
                      setSearch(`${u.name} (${u.email || u.id})`);
                    }}
                  >
                    <div className="text-sm font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email || u.id}</div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
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
