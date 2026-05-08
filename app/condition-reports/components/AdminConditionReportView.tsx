'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { Button } from '@/src/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/src/components/ui/pagination';
import { useConditionReports, useReportFilters } from '../hooks/useConditionReports';
import { SeverityBadge, ReportStatusBadge } from './Badges';
import { ConditionReportFilterBar } from './ConditionReportFilterBar';
import { ResolveReportModal } from './ResolveReportModal';
import { ConditionReportResponse } from '../schemas/condition-report-schemas';
import Link from 'next/link';

/**
 * AdminConditionReportView - Full condition reports list for Admin/Manager
 * Includes filtering, pagination, and status management
 */
export function AdminConditionReportView() {
  const { filters, setFilter } = useReportFilters();
  const { data, isLoading, error } = useConditionReports(filters);
  const [selectedReport, setSelectedReport] = useState<ConditionReportResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
        Failed to load condition reports. Please try again.
      </div>
    );
  }

  const handleOpenModal = (report: ConditionReportResponse) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handlePageChange = (newPage: number) => {
    setFilter({ ...filters, page: newPage });
  };

  const pagination = data?.pagination;
  const uiPage = (pagination?.page || 0) + 1; // Convert back to 1-indexed for display

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <h1 className="text-2xl font-semibold">Condition Reports</h1>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-semibold mb-4">Filters</h3>
        <ConditionReportFilterBar />
      </div>

      {/* Reports Table */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-950">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
          </div>
        ) : data && data.items.length > 0 ? (
          <>
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((report) => (
                  <TableRow
                    key={report.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
                  >
                    <TableCell className="font-medium">
                      <Link
                        href={`/assets/${report.assetId}`}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {report.assetId}
                      </Link>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {report.reportedByName}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-700 dark:text-gray-300">
                      {report.issue}
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={report.severity} />
                    </TableCell>
                    <TableCell>
                      <ReportStatusBadge status={report.status} />
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {report.status !== 'RESOLVED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(report)}
                        >
                          Resolve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center p-4 border-t border-gray-200 dark:border-gray-800">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          uiPage > 1 && handlePageChange(uiPage - 2)
                        }
                        className={uiPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>

                    {Array.from({ length: pagination.totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      // Show current page and adjacent pages
                      if (
                        pageNum === uiPage ||
                        pageNum === uiPage - 1 ||
                        pageNum === uiPage + 1 ||
                        pageNum === 1 ||
                        pageNum === pagination.totalPages
                      ) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => handlePageChange(i)}
                              isActive={pageNum === uiPage}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          uiPage < pagination.totalPages &&
                          handlePageChange(uiPage)
                        }
                        className={
                          uiPage === pagination.totalPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <AlertTriangle className="h-8 w-8 mb-2 opacity-50" />
            <p>No condition reports found</p>
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      {selectedReport && (
        <ResolveReportModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          report={selectedReport}
        />
      )}
    </div>
  );
}
