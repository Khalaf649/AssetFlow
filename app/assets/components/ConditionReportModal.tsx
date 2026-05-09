"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
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
import { Asset } from "../schemas/asset-schemas";
import {
  conditionReportCreateSchema,
  conditionReportSeverityEnum,
  ConditionReportCreateInput,
} from "../schemas/condition-report-schemas";
import { useCreateConditionReport } from "../hooks/useConditionReportMutations";

interface ConditionReportModalProps {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
}

const DEFAULT_VALUES: ConditionReportCreateInput = {
  issue: "",
  severity: "MEDIUM",
};

export function ConditionReportModal({
  open,
  onClose,
  asset,
}: ConditionReportModalProps) {
  const form = useForm<ConditionReportCreateInput>({
    resolver: zodResolver(conditionReportCreateSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      form.reset(DEFAULT_VALUES);
    }
  }, [open, form]);

  const handleClose = () => {
    form.reset(DEFAULT_VALUES);
    onClose();
  };

  const { mutate: createConditionReport, isPending } = useCreateConditionReport(
    {
      assetId: asset?.id ?? "",
      setError: form.setError,
      onSuccess: handleClose,
    },
  );

  const onSubmit = (data: ConditionReportCreateInput) => {
    createConditionReport(data);
  };

  if (!asset) return null;

  const rootError =
    form.formState.errors.root?.message ??
    form.formState.errors.root?.serverError?.message;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit Condition Report</DialogTitle>
          <DialogDescription>
            Report an issue for {asset.brand} {asset.model}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="rounded-lg border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                {asset.serialNumber}
              </p>
              <p>
                Use this form to record hardware issues, damage, or
                malfunctions.
              </p>
            </div>

            {rootError ? (
              <p className="text-sm text-destructive">{rootError}</p>
            ) : null}

            <FormField
              control={form.control}
              name="issue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the problem in at least 10 characters..."
                      className="min-h-28 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific about the hardware problem you are seeing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {conditionReportSeverityEnum.options.map((severity) => (
                        <SelectItem key={severity} value={severity}>
                          {severity.charAt(0) + severity.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Use the exact severity level that best matches the issue.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
