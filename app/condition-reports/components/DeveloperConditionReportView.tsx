"use client";

import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { useConditionReportFilters } from "../hooks/useConditionReportFilters";
import { useConditionReports } from "../hooks/useConditionReports";
import { ConditionReportFilterBar } from "./ConditionReportFilterBar";
import { DeveloperReportsList } from "./DeveloperReportsList";

export function DeveloperConditionReportView() {
  const { filters, setFilter } = useConditionReportFilters();
  // Use a consistent page size and pull pagination metadata so we can render
  // navigation controls — previously developers were stuck on page 1 forever.
  const { data, isLoading, error } = useConditionReports({
    ...filters,
    size: 20,
  });

  const reports = data?.items || [];
  const totalElements = data?.pagination?.totalElements || 0;
  // FIX Bug 4: derive totalPages so we can render pagination controls.
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="space-y-6">
      <ConditionReportFilterBar
        totalElements={totalElements}
        filters={filters}
        setFilter={setFilter}
      />

      <DeveloperReportsList
        reports={reports}
        isLoading={isLoading}
        error={error as Error | null | undefined}
      />

      {/* FIX Bug 4: pagination controls — mirrors AdminConditionReportView */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page <= 1}
            onClick={() => setFilter("page", filters.page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {filters.page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page >= totalPages}
            onClick={() => setFilter("page", filters.page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <Card className="p-6 space-y-4 border-border bg-card">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-semibold text-foreground">
              How to report a hardware issue
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Submit a report for one of your assigned assets when something
              needs attention.
            </p>
          </div>
          <Button asChild>
            <Link href="/condition-reports/new">New Report</Link>
          </Button>
        </div>

        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Open the new report flow.</li>
          <li>Select one of your assigned assets.</li>
          <li>Describe the issue with enough detail for triage.</li>
          <li>Pick LOW, MEDIUM, or HIGH severity.</li>
          <li>Submit the report for review by admins and managers.</li>
        </ol>
      </Card>
    </div>
  );
}
