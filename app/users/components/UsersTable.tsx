"use client";

import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { getRoleBadgeStyles } from "./badges-utils";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "DEVELOPER";
  createdAt: string;
}

interface UsersTableProps {
  users: UserProfile[];
  isLoading: boolean;
  isAdmin: boolean;
  onEditClick: (user: UserProfile) => void;
  onDeleteClick: (user: UserProfile) => void;
}

export function UsersTable({
  users,
  isLoading,
  isAdmin,
  onEditClick,
  onDeleteClick,
}: UsersTableProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/50">
          <TableRow className="hover:bg-secondary/40 border-border">
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
              <TableRow
                key={u.id}
                className="hover:bg-secondary/40 border-border"
              >
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
                  <Badge className={getRoleBadgeStyles(u.role)}>{u.role}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {u.createdAt}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      onClick={() => onEditClick(u)}
                    >
                      Edit
                    </Button>
                  )}
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-primary hover:text-primary-foreground"
                      onClick={() => onDeleteClick(u)}
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
  );
}
