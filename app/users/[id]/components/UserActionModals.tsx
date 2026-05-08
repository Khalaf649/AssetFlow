"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateRoleSchema, UpdateRoleInput } from "../schemas/users-schemas";
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
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
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
import { useUpdateRole } from "../hooks/useUpdateRole";
import { useDeleteUser } from "../hooks/useDeleteUser";

interface UserActionModalsProps {
  editUser: any | null;
  deleteUser: any | null;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onDeleteSuccess: () => void;
}

export function UserActionModals({
  editUser,
  deleteUser,
  onCloseEdit,
  onCloseDelete,
  onDeleteSuccess,
}: UserActionModalsProps) {
  const form = useForm<UpdateRoleInput>({
    resolver: zodResolver(updateRoleSchema),
  });

  // Sync form when editUser changes
  useEffect(() => {
    if (editUser) {
      form.reset({ role: editUser.role });
    }
  }, [editUser, form]);

  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole({
    setError: form.setError,
    onSuccessCallback: () => {
      onCloseEdit();
      form.reset();
    },
  });

  const { mutate: deleteUserMutation, isPending: isDeleting } = useDeleteUser({
    onSuccessCallback: () => {
      onCloseDelete();
      onDeleteSuccess();
    },
    onErrorCallback: (message: string) => {
      // Error handling is done within the mutation
    },
  });

  const handleUpdateRole = (input: UpdateRoleInput) => {
    if (!editUser) return;
    updateRole({ id: editUser.id, input });
  };

  const handleDeleteUser = () => {
    if (!deleteUser) return;
    deleteUserMutation(deleteUser.id);
  };

  return (
    <>
      {/* Edit Role Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => onCloseEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Update the role for {editUser?.name}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateRole)}>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                        <SelectItem value="DEVELOPER">Developer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <p className="text-sm text-destructive mt-4">
                  {form.formState.errors.root.message}
                </p>
              )}

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onCloseEdit()}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Role"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={!!deleteUser} onOpenChange={() => onCloseDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteUser?.name}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
