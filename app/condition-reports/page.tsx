'use client';

import { Loader2 } from 'lucide-react';
import { useAuth } from '@/app/auth/context/AuthContext';
import { AdminConditionReportView } from './components/AdminConditionReportView';
import { DeveloperConditionReportView } from './components/DeveloperConditionReportView';

export default function ConditionReportsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  console.log('Current user:', user);

 const isStaff = true;

  return isStaff ? <AdminConditionReportView /> : <DeveloperConditionReportView />;
}