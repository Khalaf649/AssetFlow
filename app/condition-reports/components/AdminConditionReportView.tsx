'use client';

import { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/src/components/ui/table';
import { Button } from '@/src/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { useConditionReports, useReportFilters } from '../hooks/useConditionReports';
import { SeverityBadge, ReportStatusBadge } from './Badges';
import { ResolveReportModal } from './ResolveReportModal';
import { ConditionReportResponse } from '../schemas/condition-report-schemas';

export function AdminConditionReportView() {
  const { filters, activeTab, setActiveTab } = useReportFilters();
  const { data, isLoading, error } = useConditionReports({ ...filters, size: 100 });
  const [selectedReport, setSelectedReport] = useState<ConditionReportResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (report: ConditionReportResponse) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded text-sm">
        Failed to load condition reports. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      {/* Title */}
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-orange-500" />
        Condition Reports
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent border-b border-gray-200 rounded-none p-0 h-auto gap-0 w-full justify-start">
          {[
            { value: 'all',         label: 'All'         },
            { value: 'OPEN',        label: 'Open'        },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'RESOLVED',    label: 'Resolved'    },
          ].map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm text-gray-500
                         data-[state=active]:border-blue-500 data-[state=active]:text-blue-600
                         data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : data && data.items.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-white border-b border-gray-200 hover:bg-white">
                <TableHead className="text-gray-600 font-semibold text-sm py-3">Asset</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm py-3">Reported By</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm py-3">Issue</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm py-3">Severity</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm py-3">Status</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm py-3 bg-blue-50 text-blue-600">
                  Date ▾
                </TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm py-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((report) => (
                <TableRow
                  key={report.id}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-semibold text-gray-900 py-4">
                    {report.assetName ?? report.assetId}
                  </TableCell>
                  <TableCell className="text-gray-500 py-4">{report.reportedByName}</TableCell>
                  <TableCell className="text-gray-700 py-4">{report.issue}</TableCell>
                  <TableCell className="py-4">
                    <SeverityBadge severity={report.severity} />
                  </TableCell>
                  <TableCell className="py-4">
                    <ReportStatusBadge status={report.status} />
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm py-4">
                    {new Date(report.createdAt).toISOString().slice(0, 10)}
                  </TableCell>
                  <TableCell className="py-4">
                    {report.status !== 'RESOLVED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenModal(report)}
                        className="text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Resolve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <p className="text-sm">No condition reports found</p>
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