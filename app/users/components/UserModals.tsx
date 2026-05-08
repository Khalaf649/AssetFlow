"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useUpdateRole } from "../hooks/useUpdateRole";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { UpdateRoleInput, updateRoleSchema } from "../schemas/users-schemas";
import { zodResolver } from "@hookform/resolvers/zod";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "DEVELOPER";
  createdAt: string;
}

interface UserModalsProps {
  editUser: UserProfile | null;
  deleteUser: UserProfile | null;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
}

export function UserModals({
  editUser,
  deleteUser,
  onCloseEdit,
  onCloseDelete,
}: UserModalsProps) {
  const form = useForm<UpdateRoleInput>({
    resolver: zodResolver(updateRoleSchema),
  });

  const {
    mutate: updateRole,
    isPending: isUpdating,
    isSuccess: isUpdateSuccess,
  } = useUpdateRole({
    setError: form.setError,
  });

  const {
    mutate: deleteUserMutation,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
  } = useDeleteUser();

  // Close dialogs when mutations succeed
  useEffect(() => {
    if (isUpdateSuccess) {
      onCloseEdit();
      form.reset();
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (isDeleteSuccess) {
      onCloseDelete();
    }
  }, [isDeleteSuccess]);

  // Sync form when editUser changes
  useEffect(() => {
    if (editUser) {
      form.reset({ role: editUser.role });
    }
  }, [editUser]);

  const handleDelete = () => {
    if (!deleteUser) return;
    deleteUserMutation(deleteUser.id);
  };

  const handleSave = (data: UpdateRoleInput) => {
    if (!editUser) return;
    updateRole({ id: editUser.id, input: data });
  };

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteUser}
        onOpenChange={(o) => !o && onCloseDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            {deleteUser && (
              <AlertDialogDescription>
                This will permanently remove {deleteUser.name} from the
                directory. This action cannot be undone.
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Role Dialog */}
      <Dialog open={!!editUser} onOpenChange={(o) => !o && onCloseEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              Update profile details and role assignment.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(handleSave)}
            className="space-y-4 py-2"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={form.watch("role")}
                onValueChange={(v) =>
                  form.setValue("role", v as "ADMIN" | "MANAGER" | "DEVELOPER")
                }
              >
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="DEVELOPER">Developer</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.root && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCloseEdit}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
