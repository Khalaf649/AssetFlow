"use client";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { useAssetAllocations } from "../hooks/useAssetAllocations";
import type { Allocation } from "../schemas/asset-schemas";

interface AllocationHistoryTableProps {
  assetId: string;
}

export function AllocationHistoryTable({ assetId }: AllocationHistoryTableProps) {
  const { data: allocations, isLoading } = useAssetAllocations(assetId);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="font-semibold mb-4">
        Allocation History ({allocations?.length || 0})
      </h2>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading allocations...</p>
      ) : !allocations || allocations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No allocation history for this asset.</p>
      ) : (
        <div className="overflow-hidden rounded-md border border-border">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow className="hover:bg-secondary/40 border-border">
                <TableHead>User</TableHead>
                <TableHead>Assigned At</TableHead>
                <TableHead>Returned At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocations.map((alloc: Allocation) => (
                <TableRow key={alloc.id} className="hover:bg-secondary/40 border-border">
                  <TableCell className="font-medium">{alloc.user.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(alloc.assignedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {alloc.returnedAt ? new Date(alloc.returnedAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    {alloc.returnedAt === null ? (
                      <Badge className="bg-accent/15 text-accent border border-accent/30 font-medium">Currently Assigned</Badge>
                    ) : (
                      <Badge className="bg-muted text-muted-foreground border border-border font-medium">Returned</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
