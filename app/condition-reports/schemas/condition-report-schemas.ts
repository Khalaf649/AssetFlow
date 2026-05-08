import { z } from 'zod';

/**
 * Severity levels for condition reports
 */
export const SeverityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export type Severity = z.infer<typeof SeverityEnum>;

/**
 * Report status lifecycle
 */
export const ReportStatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']);
export type ReportStatus = z.infer<typeof ReportStatusEnum>;

/**
 * Schema for submitting a new condition report
 * Used in ReportIssueForm
 */
export const submitReportSchema = z.object({
  issue: z
    .string()
    .min(10, 'Issue description must be at least 10 characters')
    .max(500, 'Issue description cannot exceed 500 characters'),
  severity: SeverityEnum,
});

export type SubmitReportInput = z.infer<typeof submitReportSchema>;

/**
 * Schema for resolving/updating a condition report
 * Used in ResolveReportModal
 */
export const resolveReportSchema = z.object({
  status: ReportStatusEnum,
  resolution: z.string().optional(),
}).refine(
  (data) => {
    // If status is RESOLVED, resolution must be non-empty
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

/**
 * Schema for URL-based filtering of condition reports
 * Coerces URL strings to typed values with pagination
 */
export const filterReportSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((v) => Math.max(1, parseInt(v, 10) || 1)) // UI page is 1-indexed
    .transform((v) => v - 1), // Convert to 0-indexed for API
  size: z
    .string()
    .optional()
    .default('10')
    .transform((v) => {
      const parsed = parseInt(v, 10);
      // Clamp size between 1 and 100
      return Math.max(1, Math.min(100, parsed || 10));
    }),
  status: ReportStatusEnum.optional(),
  severity: SeverityEnum.optional(),
  assetId: z.string().optional(),
  userId: z.string().optional(), // For filtering by reporter (developer view)
});

export type FilterReportInput = z.infer<typeof filterReportSchema>;

/**
 * API Response types for condition reports
 */
export interface ConditionReportResponse {
  id: string;
  assetId: string;
  reportedById: string;
  reportedByName: string;
  issue: string;
  severity: Severity;
  status: ReportStatus;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
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
