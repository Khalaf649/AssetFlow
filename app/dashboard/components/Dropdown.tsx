"use client";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useAuth } from "@/app/auth/context/AuthContext";
export default function Dropdown() {
  const { user: authUser, logout } = useAuth();
  const router = useRouter();

  // Mock user for frontend testing
  const mockUser = {
    id: "dev-user-1",
    name: "Developer User",
    role: "ADMIN" as const,
  };

  const user = authUser || mockUser;

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-muted transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-accent text-accent-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:flex items-center gap-2 text-sm">
            <span className="font-medium text-foreground">{user.name}</span>
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
  );
}
