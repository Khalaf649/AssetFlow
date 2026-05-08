'use client';

import { Badge } from '@/src/components/ui/badge';
import { Severity, ReportStatus } from '../schemas/condition-report-schemas';

export function SeverityBadge({ severity }: { severity: Severity }) {
  const map: Record<Severity, string> = {
    LOW:    'bg-green-100 text-green-700 border-green-200',
    MEDIUM: 'bg-orange-100 text-orange-700 border-orange-200',
    HIGH:   'bg-red-100 text-red-600 border-red-200',
  };

  return (
    <Badge variant="outline" className={`${map[severity]} font-semibold text-xs px-3 py-0.5 rounded-full`}>
      {severity}
    </Badge>
  );
}

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const map: Record<ReportStatus, string> = {
    OPEN:        'bg-red-100 text-red-600 border-red-200',
    IN_PROGRESS: 'bg-orange-100 text-orange-600 border-orange-200',
    RESOLVED:    'bg-green-100 text-green-700 border-green-200',
  };

  const displayText = status === 'IN_PROGRESS' ? 'IN PROGRESS' : status;

  return (
    <Badge variant="outline" className={`${map[status]} font-semibold text-xs px-3 py-0.5 rounded-full`}>
      {displayText}
    </Badge>
  );
}