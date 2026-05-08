'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Textarea } from '@/src/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import {
  resolveReportSchema,
  ResolveReportInput,
  ReportStatus,
  ConditionReportResponse,
} from '../schemas/condition-report-schemas';
import { useResolveReport } from '../hooks/useConditionReports';

interface ResolveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ConditionReportResponse;
}

const STATUSES: ReportStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

/**
 * ResolveReportModal - Modal for updating/resolving a condition report
 * Used by Admin/Manager roles only
 * Enforces status transitions: OPEN -> IN_PROGRESS -> RESOLVED
 * RESOLVED status requires a non-empty resolution field
 */
export function ResolveReportModal({ isOpen, onClose, report }: ResolveReportModalProps) {
  const { mutate: resolve, isPending, error: resolveError } = useResolveReport(report.id);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(report.status);

  const form = useForm<ResolveReportInput>({
    resolver: zodResolver(resolveReportSchema),
    defaultValues: {
      status: report.status,
      resolution: report.resolution || '',
    },
  });

  // Update form when report changes
  useEffect(() => {
    form.reset({
      status: report.status,
      resolution: report.resolution || '',
    });
    setSelectedStatus(report.status);
  }, [report, form]);

  // Map API errors to form fields
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

  // Get allowed status transitions
  const allowedTransitions: Record<ReportStatus, ReportStatus[]> = {
    OPEN: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
    IN_PROGRESS: ['IN_PROGRESS', 'RESOLVED'],
    RESOLVED: ['RESOLVED'],
  };

  const validStatuses = allowedTransitions[report.status];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resolve Report</DialogTitle>
          <DialogDescription>
            Update the status and add resolution details for this condition report
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Root Error */}
            {form.formState.errors.root && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {form.formState.errors.root.message}
              </div>
            )}

            {/* Report Info */}
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm space-y-1">
              <p>
                <span className="font-medium">Asset:</span> {report.assetId}
              </p>
              <p>
                <span className="font-medium">Issue:</span> {report.issue}
              </p>
              <p>
                <span className="font-medium">Reporter:</span> {report.reportedByName}
              </p>
            </div>

            {/* Status Field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedStatus(value as ReportStatus);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {validStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Status can only progress forward: OPEN → IN_PROGRESS → RESOLVED
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resolution Field - Only shown for RESOLVED status */}
            {selectedStatus === 'RESOLVED' && (
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resolution *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe how this issue was resolved..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Required when marking as resolved
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Updating...' : 'Update Report'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
