"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/context/AuthContext";
import { useUser } from "../hooks/useUser";
import { useUpdateRole } from "../hooks/useUpdateRole";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { getRoleBadgeStyles } from "../components/badges-utils";
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
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { ArrowLeft, Edit2, Trash2, FileText } from "lucide-react";
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

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default function UserPage({ params }: UserPageProps) {
  const { id: userId } = params as any;
  const router = useRouter();
  const { user: currentUser, token } = useAuth();
  const { data: user, isLoading } = useUser(userId);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [deleteUser, setDeleteUser] = useState<any | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const form = useForm<UpdateRoleInput>({
    resolver: zodResolver(updateRoleSchema),
  });

  // RBAC Check: Developer can only view own profile
  useEffect(() => {
    if (currentUser?.role === "DEVELOPER" && currentUser.id !== userId) {
      router.push("/dashboard");
    }
  }, [currentUser, userId, router]);

  const isAdmin = currentUser?.role === "ADMIN";

  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole({
    setError: form.setError,
    onSuccessCallback: () => {
      setEditUser(null);
      form.reset();
    },
  });

  const { mutate: deleteUserMutation, isPending: isDeleting } = useDeleteUser({
    onSuccessCallback: () => {
      setDeleteUser(null);
      router.push("/users");
    },
    onErrorCallback: (message: string) => {
      setDeleteError(message);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users</span>
        </Link>

        {/* User Profile Card */}
        <Card className="bg-card border-border p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center text-xl font-bold text-secondary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <Badge className={getRoleBadgeStyles(user.role)}>
                  {user.role}
                </Badge>
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Email
                  </p>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Joined Date
                  </p>
                  <p className="text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => {
                    setEditUser(user);
                    form.reset({ role: user.role });
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Role
                </Button>
                <Button
                  onClick={() => setDeleteUser(user)}
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete User
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Assigned Assets Section */}
        <Card className="bg-card border-border p-8 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Assigned Assets
          </h2>
          {user.assignedAssets && user.assignedAssets.length > 0 ? (
            <div className="space-y-3">
              {user.assignedAssets.map((asset: any) => (
                <div
                  key={asset.id}
                  className="p-4 bg-secondary/50 border border-border rounded-lg hover:bg-secondary/40"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{asset.brand}</p>
                      <p className="text-sm text-muted-foreground">
                        {asset.model}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Serial: {asset.serialNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">
                        {asset.type}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Status: {asset.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No assets assigned</p>
          )}
        </Card>

        {/* Activity Timeline */}
        <Card className="bg-card border-border p-8">
          <h2 className="text-xl font-bold mb-6">Activity</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-3 h-3 rounded-full bg-primary mt-1.5" />
              <div>
                <p className="font-semibold">Account created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
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
                  onClick={() => setEditUser(null)}
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
      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteUser?.name}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-sm text-destructive">{deleteError}</p>
          )}
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
    </div>
  );
}
