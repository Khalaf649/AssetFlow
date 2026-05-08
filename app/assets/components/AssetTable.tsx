"use client";

import Link from "next/link";
import { Laptop, Monitor, Headphones } from "lucide-react";
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
import {
  getStatusBadgeStyles,
  formatStatus,
  daysUntil,
  getWarrantyColorClass,
} from "./badges-utils";
import type { Asset, AssetType } from "../schemas/asset-schemas";

function TypeIcon({
  type,
  className,
}: {
  type: AssetType;
  className?: string;
}) {
  const Icon =
    type === "LAPTOP" ? Laptop : type === "MONITOR" ? Monitor : Headphones;
  return <Icon className={className} />;
}

interface AssetTableProps {
  assets: Asset[];
  isLoading: boolean;
  isStaff: boolean;
  onEditClick?: (asset: Asset) => void;
  onDeleteClick?: (asset: Asset) => void;
}

export function AssetTable({
  assets,
  isLoading,
  isStaff,
  onEditClick,
  onDeleteClick,
}: AssetTableProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/50">
          <TableRow className="hover:bg-secondary/40 border-border">
            <TableHead className="w-10"></TableHead>
            <TableHead>Asset</TableHead>
            <TableHead>Serial</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Warranty</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((a) => {
            const days = daysUntil(a.warrantyExpirationDate);
            return (
              <TableRow
                key={a.id}
                className="hover:bg-secondary/40 border-border"
              >
                <TableCell>
                  <TypeIcon
                    type={a.type}
                    className="h-5 w-5 text-muted-foreground"
                  />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/assets/${a.id}`}
                    className="font-medium hover:text-accent"
                  >
                    {a.brand} {a.model}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {a.serialNumber}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeStyles(a.status)}>
                    {formatStatus(a.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {a.assignedTo?.name || "—"}
                </TableCell>
                <TableCell className={getWarrantyColorClass(days)}>
                  {days > 0 ? `${days}d left` : "Expired"}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/assets/${a.id}`}>View</Link>
                  </Button>
                  {isStaff && onEditClick && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      onClick={() => onEditClick(a)}
                    >
                      Edit
                    </Button>
                  )}
                  {isStaff && onDeleteClick && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-primary hover:text-primary-foreground"
                      onClick={() => onDeleteClick(a)}
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {!isLoading && assets.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-12"
              >
                No assets to display.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
