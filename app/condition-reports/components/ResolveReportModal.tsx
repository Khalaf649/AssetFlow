'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle,
} from '@/src/components/ui/dialog';
import {
  Form, FormControl, FormDescription,
  FormField, FormItem, FormLabel, FormMessage,
} from '@/src/components/ui/form';
import { Textarea } from '@/src/components/ui/textarea';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/src/components/ui/select';
import {
  resolveReportSchema, ResolveReportInput,
  ReportStatus, ConditionReportResponse,
} from '../schemas/condition-report-schemas';
import { useResolveConditionReport } from '../hooks/useConditionReportMutations';
import { ReportStatusBadge, SeverityBadge } from './Badges';

interface ResolveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ConditionReportResponse;
}

const allowedTransitions: Record<ReportStatus, ReportStatus[]> = {
  OPEN:        ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
  IN_PROGRESS: ['IN_PROGRESS', 'RESOLVED'],
  RESOLVED:    ['RESOLVED'],
};

export function ResolveReportModal({ isOpen, onClose, report }: ResolveReportModalProps) {
  const { mutate: resolve, isPending, error: resolveError } = useResolveConditionReport(report.id);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(report.status);

  const form = useForm<ResolveReportInput>({
    resolver: zodResolver(resolveReportSchema),
    defaultValues: {
      status:     report.status,
      resolution: report.resolution || '',
    },
  });

  useEffect(() => {
    form.reset({
      status:     report.status,
      resolution: report.resolution || '',
    });
    setSelectedStatus(report.status);
  }, [report, form]);

  useEffect(() => {
    if (resolveError && (resolveError as any).details) {
      const details = (resolveError as any).details as Array<{ field: string; message: string }>;
      details.forEach(({ field, message }) => {
        form.setError(field as any, { message });
      });
    }
  }, [resolveError, form]);

  const onSubmit = (data: ResolveReportInput) => {
    resolve(data, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

  const validStatuses = allowedTransitions[report.status];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Resolve Report
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Update the status and add resolution details for this condition report
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            {/* Root Error */}
            {form.formState.errors.root && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {form.formState.errors.root.message}
              </div>
            )}

            {/* Report Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Asset</span>
                <span className="font-medium text-gray-900">
                  {report.assetId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Reporter</span>
                <span className="font-medium text-gray-900">{report.reportedBy.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Severity</span>
                <SeverityBadge severity={report.severity} />
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-500 shrink-0">Issue</span>
                <span className="text-gray-700 text-right">{report.issue}</span>
              </div>
            </div>

            {/* Status Field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    <>Status <span className="text-red-500">*</span></>
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedStatus(value as ReportStatus);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-200 focus:ring-1 focus:ring-blue-500 text-sm">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {validStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <ReportStatusBadge status={status} />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-gray-400">
                    Status can only progress forward: OPEN → IN PROGRESS → RESOLVED
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Resolution Field */}
            {selectedStatus === 'RESOLVED' && (
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      <>Resolution <span className="text-red-500">*</span></>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe how this issue was resolved..."
                        className="resize-none border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500 text-sm"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-400">
                      Required when marking as resolved
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gray-900 hover:bg-gray-700 text-white text-sm"
              >
                {isPending
                  ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Updating...</>
                  : 'Update Report'
                }
              </Button>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}