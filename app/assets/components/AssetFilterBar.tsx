"use client";

import { Search, Package } from "lucide-react";
import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { AssetFilters } from "../schemas/asset-filter-schema";

interface AssetFilterBarProps {
  totalElements: number;
  filters: {
    q?: string;
    type?: string;
    status?: string;
  };
  setFilter: <K extends keyof AssetFilters>(
    key: K,
    value: AssetFilters[K],
  ) => void;
}

export function AssetFilterBar({
  totalElements,
  filters,
  setFilter,
}: AssetFilterBarProps) {
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
          <Package className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-semibold text-foreground">
            Asset Inventory
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
            placeholder="Search brand, model, serial…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onBlur={handleSearchBlur}
            onKeyDown={handleSearchKeyDown}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.type || ""}
          onValueChange={(v) => {
            if (v === "ALL") {
              setFilter("type", undefined);
            } else {
              setFilter(
                "type",
                v as "LAPTOP" | "MONITOR" | "ACCESSORY",
              );
            }
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="LAPTOP">Laptop</SelectItem>
            <SelectItem value="MONITOR">Monitor</SelectItem>
            <SelectItem value="ACCESSORY">Accessory</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.status || ""}
          onValueChange={(v) => {
            if (v === "ALL") {
              setFilter("status", undefined);
            } else {
              setFilter(
                "status",
                v as
                  | "AVAILABLE"
                  | "ASSIGNED"
                  | "UNDER_REPAIR"
                  | "DECOMMISSIONED",
              );
            }
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="ASSIGNED">Assigned</SelectItem>
            <SelectItem value="UNDER_REPAIR">Under Repair</SelectItem>
            <SelectItem value="DECOMMISSIONED">Decommissioned</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
