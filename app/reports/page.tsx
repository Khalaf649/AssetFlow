'use client';

import { useSearchParams } from 'next/navigation';
import { DashboardStatsPanel } from './components/DashboardStatsPanel';
import { UsageReportView } from './components/UsageReportView';
import { WarrantyExpiryView } from './components/WarrantyExpiryView';
import { ReportFilterBar } from './components/ReportFilterBar';

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'overview';

  return (
    <div className="space-y-6">
      <ReportFilterBar />
      {activeTab === 'overview' && <DashboardStatsPanel />}
      {activeTab === 'usage' && <UsageReportView />}
      {activeTab === 'warranty' && <WarrantyExpiryView />}
    </div>
  );
}