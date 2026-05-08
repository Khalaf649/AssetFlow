"use client";

import {
  BarChart2,
  Boxes,
  AlertTriangle,
  Users,
  Monitor,
  UserCog,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/app/auth/context/AuthContext";
import { useDashboardReports } from "../hooks/useDashboardHooks";
import { KpiCard } from "./KpiCard";
import { DashboardCard } from "./DashboardCard";

export function AdminManagerView() {
  const { user } = useAuth();
  const { data: reports, isLoading, isError } = useDashboardReports();
  const currentUser = user || {
    id: "dev-user-1",
    name: "Developer User",
    role: "ADMIN" as const,
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-2" />
          <div className="h-4 w-96 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (isError || !reports) {
    return (
      <div className="space-y-8">
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive">
          <p className="font-medium">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.role === "ADMIN";

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your organization&apos;s IT inventory.
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Assets"
          value={reports.totalAssets}
          icon={Boxes}
          accent="border-l-accent"
        />
        <KpiCard
          label="Assigned"
          value={reports.byStatus.ASSIGNED}
          icon={Users}
          accent="border-l-primary"
        />
        <KpiCard
          label="Under Repair"
          value={reports.byStatus.UNDER_REPAIR}
          icon={Clock}
          accent="border-l-warning"
        />
        <KpiCard
          label="Warranty Expiring"
          value={reports.warrantyExpiringIn30Days}
          icon={ShieldCheck}
          accent="border-l-destructive"
        />
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DashboardCard
          to="/users"
          title="Personnel Directory"
          description="Browse and manage team members."
          icon={Users}
        />
        <DashboardCard
          to="/assets"
          title="Asset Inventory"
          description="View, assign, and manage all assets."
          icon={Monitor}
        />
        <DashboardCard
          to="/condition-reports"
          title="Condition Reports"
          description="Track open issues with equipment."
          icon={AlertTriangle}
          badge={reports.openConditionReports}
        />
        <DashboardCard
          to="/reports"
          title="Analytics & Reports"
          description="Usage stats and warranty insights."
          icon={BarChart2}
        />
        {isAdmin && (
          <DashboardCard
            to="/users"
            title="Assign Roles"
            description="Promote and update user permissions."
            icon={UserCog}
          />
        )}
      </div>
    </div>
  );
}
