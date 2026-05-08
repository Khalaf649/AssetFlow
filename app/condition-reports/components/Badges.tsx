'use client';

import { Badge } from '@/src/components/ui/badge';
import { Severity, ReportStatus } from '../schemas/condition-report-schemas';

/**
 * SeverityBadge - Displays severity level with color coding
 * LOW: green/success
 * MEDIUM: amber/warning
 * HIGH: red/destructive
 */
export function SeverityBadge({ severity }: { severity: Severity }) {
  const styles: Record<Severity, string> = {
    LOW: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    MEDIUM: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    HIGH: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  };

  return (
    <Badge className={`font-medium ${styles[severity]}`}>
      {severity}
    </Badge>
  );
}

/**
 * ReportStatusBadge - Displays report status with color coding
 * OPEN: red/destructive
 * IN_PROGRESS: amber/warning
 * RESOLVED: green/success
 */
export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const styles: Record<ReportStatus, string> = {
    OPEN: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    IN_PROGRESS: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    RESOLVED: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  };

  return (
    <Badge className={`font-medium ${styles[status]}`}>
      {status.replace('_', ' ')}
    </Badge>
  );
}
