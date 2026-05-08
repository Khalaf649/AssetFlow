"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/app/auth/context/AuthContext";
import { NotificationBell } from "./NotificationBell";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

const NAV_LINKS: Array<{
  to: string;
  label: string;
  roles: ReadonlyArray<"ADMIN" | "MANAGER" | "DEVELOPER">;
}> = [
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
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // ProtectedLayout guarantees user is non-null
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-muted transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-accent text-accent-foreground text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:flex items-center gap-2 text-sm">
                  <span className="font-medium text-foreground">
                    {user.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-accent/10 text-accent border-0 text-[10px] py-0 font-semibold"
                  >
                    {user.role}
                  </Badge>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/users/${user.id}`}>
                  <UserIcon className="h-4 w-4 mr-2" /> My profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
