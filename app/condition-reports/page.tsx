'use client';

import { useAuth } from '@/app/auth/context/AuthContext';
import { AdminConditionReportView } from './components/AdminConditionReportView';
import { DeveloperConditionReportView } from './components/DeveloperConditionReportView';

/**
 * Condition Reports Page - Traffic Controller
 * Routes based on user role:
 * - DEVELOPER: Shows only their own reports
 * - ADMIN/MANAGER: Shows all reports with management capabilities
 */
export default function ConditionReportsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const isStaff = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  return (
    <div className="container mx-auto py-8 px-4">
      {isStaff ? (
        <AdminConditionReportView />
      ) : (
        <DeveloperConditionReportView />
      )}
    </div>
  );
}
