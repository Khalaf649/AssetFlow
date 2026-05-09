'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import {
  ConditionReportResponse,
} from '../schemas/condition-report-schemas';
import { useConditionReportFilters } from '../hooks/useConditionReportFilters';
import { useConditionReports } from '../hooks/useConditionReports';
import { ConditionReportFilterBar } from './ConditionReportFilterBar';
import { DeveloperReportsList } from './DeveloperReportsList';
import { ResolveReportModal } from './ResolveReportModal';

export function AdminConditionReportView() {
  const { filters, setFilter } = useConditionReportFilters();
  const { data, isLoading, error } = useConditionReports({ ...filters, size: 20 });
  const [selectedReport, setSelectedReport] = useState<ConditionReportResponse | null>(null);

  const reports = data?.items || [];
  const totalElements = data?.pagination?.totalElements || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="space-y-6">
      <ConditionReportFilterBar
        totalElements={totalElements}
        filters={filters}
        setFilter={setFilter}
        showAssetFilter
      />

      <DeveloperReportsList
        reports={reports}
        isLoading={isLoading}
        error={error as Error | null | undefined}
        onResolveClick={setSelectedReport}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page <= 1}
            onClick={() => setFilter('page', filters.page - 1)}
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
            onClick={() => setFilter('page', filters.page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {selectedReport && (
        <ResolveReportModal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          report={selectedReport}
        />
      )}
    </div>
  );
}