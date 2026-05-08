'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
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
import { submitReportSchema, SubmitReportInput, Severity } from '../schemas/condition-report-schemas';
import { useSubmitReport } from '../hooks/useConditionReports';
import { useEffect } from 'react';

interface ReportIssueFormProps {
  assetId: string;
  assetName: string;
  onSuccess?: () => void;
}

const SEVERITIES: Severity[] = ['LOW', 'MEDIUM', 'HIGH'];

/**
 * ReportIssueForm - Form for submitting a new condition report
 * Used by all authenticated users on assets they own
 * Includes validation, error handling, and success callbacks
 */
export function ReportIssueForm({ assetId, assetName, onSuccess }: ReportIssueFormProps) {
  const { mutate: submitReport, isPending, error: submitError } = useSubmitReport(assetId);

  const form = useForm<SubmitReportInput>({
    resolver: zodResolver(submitReportSchema),
    defaultValues: {
      issue: '',
      severity: 'MEDIUM',
    },
  });

  // Map API errors to form fields
  useEffect(() => {
    if (submitError && (submitError as any).details) {
      const details = (submitError as any).details as Array<{ field: string; message: string }>;
      details.forEach(({ field, message }) => {
        form.setError(field as any, { message });
      });
    }
  }, [submitError, form]);

  // Map server-side validation errors (422) to form fields
  useEffect(() => {
    if (submitError && (submitError as any).code === 'VALIDATION_ERROR') {
      form.setError('root', { message: submitError.message });
    }
  }, [submitError, form]);

  const onSubmit = (data: SubmitReportInput) => {
    submitReport(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Report Issue</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Asset: <span className="font-medium">{assetName}</span>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Root Error */}
          {form.formState.errors.root && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Issue Field */}
          <FormField
            control={form.control}
            name="issue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the issue in detail (minimum 10 characters)..."
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a clear description of the hardware issue
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Severity Field */}
          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity Level *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SEVERITIES.map((severity) => (
                      <SelectItem key={severity} value={severity}>
                        {severity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Indicate how critical this issue is
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit Report'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isPending}
            >
              Clear
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
