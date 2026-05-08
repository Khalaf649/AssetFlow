"use client";

import { Laptop, Monitor, AlertTriangle, UserCog } from "lucide-react";
import { useAuth } from "@/app/auth/context/AuthContext";
import { DashboardCard } from "./DashboardCard";

export function DeveloperView() {
  const { user } = useAuth();

  // ProtectedLayout guarantees user is non-null
  if (!user) return null;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">
          Hello, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your equipment overview.
        </p>
      </header>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DashboardCard
          to={`/assets?assignedUserId=${user.id}`}
          title="My Equipment"
          description="Laptops, monitors, and accessories assigned to you."
          icon={Laptop}
        />
        <DashboardCard
          to="/assets?type=LAPTOP&status=AVAILABLE"
          title="Spare Laptops"
          description="Browse spare laptops available to request."
          icon={Monitor}
        />
        <DashboardCard
          to="/condition-reports/new"
          title="Report an Issue"
          description="Submit a condition report for any of your equipment."
          icon={AlertTriangle}
        />
        <DashboardCard
          to={`/users/${user.id}`}
          title="My Profile"
          description="View your account and assigned equipment."
          icon={UserCog}
        />
      </div>
    </div>
  );
}
