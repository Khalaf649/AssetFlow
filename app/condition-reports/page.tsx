'use client';

import { useAuth } from '@/app/auth/context/AuthContext';
import { AdminConditionReportView } from './components/AdminConditionReportView';
import { DeveloperConditionReportView } from './components/DeveloperConditionReportView';

export default function ConditionReportsPage() {
  const { user } = useAuth();

  if (!user) return null;

  const isStaff = user.role === 'ADMIN' || user.role === 'MANAGER';

  return isStaff ? <AdminConditionReportView /> : <DeveloperConditionReportView />;
}