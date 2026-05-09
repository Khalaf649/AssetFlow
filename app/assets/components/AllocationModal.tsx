"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  allocationSchema,
  AllocationInput,
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
import { useAssignAsset, useReturnAsset } from "../hooks/useAllocations";
import { useUserSearch } from "../hooks/useUserSearch";

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const form = useForm<AllocationInput>({
    resolver: zodResolver(allocationSchema),
    defaultValues: { userId: "" },
  });

  const {
    search,
    isOpen,
    isFetching,
    selectedUser,
    users,
    handleSelect,
    handleSearchChange,
    reset: resetSearch,
  } = useUserSearch();

  // Reset everything when the modal opens/closes
  useEffect(() => {
    if (open) {
      form.reset({ userId: "" });
      resetSearch();
    }
  }, [open, form, resetSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        // Close dropdown but keep selected value
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    form.reset();
    resetSearch();
    onClose();
  };

  const { mutate: assignAsset, isPending: isAssigning } = useAssignAsset({
    assetId: asset?.id ?? "",
    setError: form.setError,
    onSuccess: handleClose,
  });

  const { mutate: returnAsset, isPending: isReturning } = useReturnAsset({
    assetId: asset?.id ?? "",
    setError: form.setError,
    onSuccess: handleClose,
  });

  const isPending = isAssigning || isReturning;

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
              ? `Return ${asset.brand} ${asset.model} from ${asset.assignedTo?.name ?? "the current user"}`
              : `Assign ${asset.brand} ${asset.model} to a user`}
          </DialogDescription>
        </DialogHeader>

        {isAssigned ? (
          /* ── Return Flow ── */
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
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={() => returnAsset()} disabled={isPending}>
                {isReturning ? "Returning..." : "Return Asset"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* ── Assign Flow ── */
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((d) => assignAsset(d))}
              className="space-y-4"
            >
              {/* User search with dropdown */}
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign To</FormLabel>

                    {/* Search input */}
                    <FormControl>
                      <div className="relative" ref={dropdownRef}>
                        <Input
                          value={search}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          placeholder="Search by name or email…"
                          autoComplete="off"
                          className={selectedUser ? "pr-8 text-foreground" : ""}
                        />

                        {/* Clear button when a user is selected */}
                        {selectedUser && (
                          <button
                            type="button"
                            onClick={() => {
                              handleSearchChange("");
                              field.onChange("");
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
                            aria-label="Clear selection"
                          >
                            ×
                          </button>
                        )}

                        {/* Dropdown list */}
                        {isOpen && (
                          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                            {isFetching ? (
                              <div className="px-3 py-2 text-sm text-muted-foreground">
                                Searching…
                              </div>
                            ) : users.length === 0 ? (
                              <div className="px-3 py-2 text-sm text-muted-foreground">
                                No users found.
                              </div>
                            ) : (
                              <ul className="max-h-48 overflow-auto py-1">
                                {users.map((u) => (
                                  <li
                                    key={u.id}
                                    onMouseDown={(e) => {
                                      // onMouseDown fires before onBlur so the value is committed
                                      e.preventDefault();
                                      handleSelect(u, field.onChange);
                                    }}
                                    className="flex flex-col gap-0.5 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                                  >
                                    <span className="text-sm font-medium">
                                      {u.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {u.email ?? u.id}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>

                    <FormDescription>
                      Type a name or email to search, then click to select.
                    </FormDescription>
                    <FormMessage />

                    {/* Hidden input keeps the userId in the form */}
                    <input type="hidden" {...field} />
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
                  variant="outline"
                  type="button"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending || !selectedUser}>
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
