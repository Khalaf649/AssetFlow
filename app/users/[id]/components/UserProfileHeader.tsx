"use client";

import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { ShieldCheck, Trash2, Mail } from "lucide-react";
import { getRoleBadgeStyles } from "../../components/badges-utils";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "DEVELOPER";
  createdAt: string;
}

interface UserProfileHeaderProps {
  user: UserProfile;
  isAdmin: boolean;
  onEditClick: (user: UserProfile) => void;
  onDeleteClick: (user: UserProfile) => void;
}

export function UserProfileHeader({
  user,
  isAdmin,
  onEditClick,
  onDeleteClick,
}: UserProfileHeaderProps) {
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-CA"); // YYYY-MM-DD

  return (
    <Card className="bg-card border-border p-6 mb-6">
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center text-accent font-semibold text-lg shrink-0">
          {initials}
        </div>

        {/* Name + Badge + Meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold truncate">{user.name}</h1>
            <Badge className={getRoleBadgeStyles(user.role)}>{user.role}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </span>
            <span>Joined {joinedDate}</span>
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditClick(user)}
              className="hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Edit Role
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onDeleteClick(user)}
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
