"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes } from "lucide-react";
import { useAuth } from "@/app/auth/context/AuthContext";
import { NotificationBell } from "./NotificationBell";
import Dropdown from "./Dropdown";

interface NavLinks {
  to: string;
  label: string;
  roles: ReadonlyArray<"ADMIN" | "MANAGER" | "DEVELOPER">;
}

const NAV_LINKS: Array<NavLinks> = [
  {
    to: "/dashboard",
    label: "Dashboard",
    roles: ["ADMIN", "MANAGER", "DEVELOPER"],
  },
  { to: "/users", label: "People", roles: ["ADMIN", "MANAGER"] },
  { to: "/assets", label: "Assets", roles: ["ADMIN", "MANAGER", "DEVELOPER"] },
  {
    to: "/condition-reports",
    label: "Reports",
    roles: ["ADMIN", "MANAGER", "DEVELOPER"],
  },
  { to: "/reports", label: "Analytics", roles: ["ADMIN", "MANAGER"] },
];

export function DashboardNavbar() {
  const { user: authUser } = useAuth();

  const pathname = usePathname();

  // Mock user for frontend testing
  const mockUser = {
    id: "dev-user-1",
    name: "Developer User",
    role: "ADMIN" as const,
  };

  const user = authUser || mockUser;

  const visibleLinks = NAV_LINKS.filter((link) =>
    link.roles.includes(user.role),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex h-14 max-w-350 items-center gap-4 px-4">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Boxes className="h-5 w-5" />
          <span className="hidden sm:inline">AssetTrack</span>
        </Link>

        {/* Main Navigation */}
        <nav className="hidden md:flex items-center gap-1 ml-6">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                pathname === link.to
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : "text-primary-foreground/75 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-3">
          {/* Notification Bell */}
          <NotificationBell />

          {/* User Dropdown */}
          <Dropdown />
        </div>
      </div>
    </header>
  );
}
