"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  submitReportSchema,
  SubmitReportInput,
  Severity,
} from "../schemas/condition-report-schemas";
import { useSubmitConditionReport } from "../hooks/useConditionReportMutations";
import { SeverityBadge } from "./Badges";

interface ReportIssueFormProps {
  assetId: string;
  assetName: string;
  onSuccess?: () => void;
}

const SEVERITIES: Severity[] = ["LOW", "MEDIUM", "HIGH"];

export function ReportIssueForm({
  assetId,
  assetName,
  onSuccess,
}: ReportIssueFormProps) {
  const {
    mutate: submitReport,
    isPending,
    error: submitError,
  } = useSubmitConditionReport(assetId);

  const form = useForm<SubmitReportInput>({
    resolver: zodResolver(submitReportSchema),
    defaultValues: {
      issue: "",
      severity: "MEDIUM",
    },
  });

  useEffect(() => {
    if (!submitError) return;

    const details = (submitError as any).details as
      | Array<{ field: string; issue: string }>
      | undefined;

    if (details && details.length > 0) {
      // Field-level validation errors — show inline under each input.
      details.forEach(({ field, issue }) => {
        form.setError(field as keyof SubmitReportInput, { message: issue });
      });
    } else {
      // Generic / unexpected error — show at the top of the form.
      form.setError("root", { message: (submitError as Error).message });
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
        <h2 className="text-lg font-semibold text-gray-900">Report Issue</h2>
        <p className="text-sm text-gray-500 mt-1">
          Asset: <span className="font-medium text-gray-700">{assetName}</span>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Root Error */}
          {form.formState.errors.root && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Issue Field */}
          <FormField
            control={form.control}
            name="issue"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  <>
                    Issue Description <span className="text-red-500">*</span>
                  </>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the issue in detail (minimum 10 characters)..."
                    className="resize-none border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 text-sm"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-400">
                  Provide a clear description of the hardware issue
                </FormDescription>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Severity Field */}
          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  <>
                    Severity Level <span className="text-red-500">*</span>
                  </>
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="border-gray-200 focus:ring-1 focus:ring-blue-500 text-sm">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SEVERITIES.map((severity) => (
                      <SelectItem key={severity} value={severity}>
                        <div className="flex items-center gap-2">
                          <SeverityBadge severity={severity} />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs text-gray-400">
                  Indicate how critical this issue is
                </FormDescription>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gray-900 hover:bg-gray-700 text-white text-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isPending}
              className="border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
            >
              Clear
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
