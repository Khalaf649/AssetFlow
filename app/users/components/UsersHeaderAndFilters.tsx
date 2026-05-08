"use client";

import { Search, Users as UsersIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { UserFilters } from "../schemas/filter-schema";

interface UsersHeaderAndFiltersProps {
  totalElements: number;
  filters: {
    q?: string;
    role?: "ADMIN" | "MANAGER" | "DEVELOPER";
  };
  setFilter: <K extends keyof UserFilters>(
    key: K,
    value: UserFilters[K],
  ) => void;
}

export function UsersHeaderAndFilters({
  totalElements,
  filters,
  setFilter,
}: UsersHeaderAndFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.q || "");

  const handleSearchBlur = () => {
    setFilter("q", searchInput);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilter("q", searchInput);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <UsersIcon className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-semibold text-foreground">
            Personnel Directory
          </h1>
          <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
            {totalElements}
          </span>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-60">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onBlur={handleSearchBlur}
            onKeyDown={handleSearchKeyDown}
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
    </div>
  );
}
