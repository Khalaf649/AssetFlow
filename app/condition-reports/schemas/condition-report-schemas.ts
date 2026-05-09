import { z } from "zod";

export const SeverityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
export type Severity = z.infer<typeof SeverityEnum>;

export const ReportStatusEnum = z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]);
export type ReportStatus = z.infer<typeof ReportStatusEnum>;

export const submitReportSchema = z.object({
  issue: z
    .string()
    .min(10, 'Issue description must be at least 10 characters')
    .max(500, 'Issue description cannot exceed 500 characters'),
  severity: SeverityEnum,
});

export type SubmitReportInput = z.infer<typeof submitReportSchema>;

export const resolveReportSchema = z
  .object({
    status: ReportStatusEnum,
    resolution: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.status === 'RESOLVED') {
        return data.resolution && data.resolution.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Resolution is required when status is RESOLVED',
      path: ['resolution'],
    }
  );

export type ResolveReportInput = z.infer<typeof resolveReportSchema>;

export const filterReportSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  status: ReportStatusEnum.optional(),
  severity: SeverityEnum.optional(),
  assetId: z.string().optional(),
  userId: z.string().optional(),
});

export type FilterReportInput = z.infer<typeof filterReportSchema>;

export interface ConditionReportResponse {
  id: string;
  assetId: string;
  reportedBy: {
    id: string;
    name: string;
  };
  issue: string;
  severity: Severity;
  status: ReportStatus;
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface PaginatedReportsResponse {
  items: ConditionReportResponse[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}