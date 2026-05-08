"use client";

import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { Edit2, Trash2 } from "lucide-react";
import { getRoleBadgeStyles } from "../components/badges-utils";

interface UserProfileHeaderProps {
  user: any;
  isAdmin: boolean;
  onEditClick: (user: any) => void;
  onDeleteClick: (user: any) => void;
}

export function UserProfileHeader({
  user,
  isAdmin,
  onEditClick,
  onDeleteClick,
}: UserProfileHeaderProps) {
  return (
    <Card className="bg-card border-border p-8 mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar & Basic Info */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center text-xl font-bold text-secondary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <Badge className={getRoleBadgeStyles(user.role)}>{user.role}</Badge>
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
              onClick={() => onEditClick(user)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Role
            </Button>
            <Button onClick={() => onDeleteClick(user)} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
