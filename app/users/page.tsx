"use client";

import { Search, Users as UsersIcon } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { Input } from "@/src/components/ui/input";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useAuth } from "@/app/auth/context/AuthContext";
import { useUserFilters } from "./hooks/useUserFilters";
import { useUsers } from "./hooks/useUsers";
import { useUpdateRole } from "./hooks/useUpdateRole";
import { useDeleteUser } from "./hooks/useDeleteUser";
import { getRoleBadgeStyles } from "./components/badges-utils";
import { useForm } from "react-hook-form";
import Link from "next/link";
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
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "DEVELOPER";
  createdAt: string;
}

export default function UsersPage() {
  return (
    <Suspense
      fallback={<div className="text-center py-12">Loading users...</div>}
    >
      <UsersPageContent />
    </Suspense>
  );
}

function UsersPageContent() {
  const { user: currentUser } = useAuth();
  const { filters, setFilter } = useUserFilters();
  const { data: usersData, isLoading } = useUsers(filters);
  const [deleteUser, setDeleteUser] = useState<UserProfile | null>(null);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [searchInput, setSearchInput] = useState(filters.q || "");

  const form = useForm({
    defaultValues: {
      role: "DEVELOPER" as "ADMIN" | "MANAGER" | "DEVELOPER",
    },
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
      setEditUser(null);
      form.reset();
      toast.success("Role updated successfully");
    },
  });

  const { mutate: deleteUserMutation, isPending: isDeleting } = useDeleteUser({
    onSuccessCallback: () => {
      setDeleteUser(null);
      toast.success("User deleted successfully");
    },
    onErrorCallback: (message: string) => {
      toast.error(message);
    },
  });

  const handleDelete = () => {
    if (!deleteUser) return;
    deleteUserMutation(deleteUser.id);
  };

  const handleSave = (data: { role: "ADMIN" | "MANAGER" | "DEVELOPER" }) => {
    if (!editUser) return;
    updateRole({
      id: editUser.id,
      input: { role: data.role },
    });
  };

  const isAdmin = currentUser?.role === "ADMIN";
  const users = usersData?.items || [];

  return (
    <div className="space-y-6">
      {/* Header - Exact Lovable JSX */}
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <UsersIcon className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-semibold text-foreground">
            Personnel Directory
          </h1>
          <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
            {usersData?.pagination?.totalElements || 0}
          </span>
        </div>
      </header>

      {/* Filters - Exact Lovable JSX */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onBlur={() => setFilter("q", searchInput)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFilter("q", searchInput);
              }
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.role || ""}
          onValueChange={(v) => {
            if (v === "") {
              setFilter("role", undefined);
            } else {
              setFilter("role", v as "ADMIN" | "MANAGER" | "DEVELOPER");
            }
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Select role..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
            <SelectItem value="DEVELOPER">Developer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table - Exact Lovable JSX */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u: UserProfile) => {
              const initials = u.name
                .split(" ")
                .map((p: string) => p[0])
                .slice(0, 2)
                .join("");
              return (
                <TableRow key={u.id} className="hover:bg-secondary/40">
                  <TableCell>
                    <Link
                      href={`/users/${u.id}`}
                      className="flex items-center gap-3 hover:text-accent"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-accent/15 text-accent text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeStyles(u.role)}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.createdAt}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditUser(u)}
                      >
                        Edit
                      </Button>
                    )}
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteUser(u)}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {!isLoading && users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-12"
                >
                  No users match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog - Exact Lovable JSX */}
      <AlertDialog
        open={!!deleteUser}
        onOpenChange={(o) => !o && setDeleteUser(null)}
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

      {/* Edit Role Dialog - Exact Lovable JSX */}
      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditUser(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
