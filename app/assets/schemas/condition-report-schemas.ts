import { z } from "zod";

export const conditionReportSeverityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

export type ConditionReportSeverity = z.infer<
  typeof conditionReportSeverityEnum
>;

export const conditionReportCreateSchema = z.object({
  issue: z
    .string()
    .trim()
    .min(10, "Issue description must be at least 10 characters"),
  severity: conditionReportSeverityEnum,
});

export type ConditionReportCreateInput = z.infer<
  typeof conditionReportCreateSchema
>;
