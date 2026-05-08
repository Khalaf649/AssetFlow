'use client';

import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  fetchConditionReport,
  fetchConditionReports,
  resolveConditionReport,
  submitConditionReport,
} from '../api/condition-reports-api';
import {
  filterReportSchema,
  FilterReportInput,
  ConditionReportResponse,
  PaginatedReportsResponse,
  SubmitReportInput,
  ResolveReportInput,
} from '../schemas/condition-report-schemas';

/**
 * useReportFilters - URL-as-State hook
 * Manages filter and pagination state via URL search params
 */
export function useReportFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse and validate filters from URL
  const rawFilters = {
    page: searchParams.get('page') || '1',
    size: searchParams.get('size') || '10',
    status: searchParams.get('status'),
    severity: searchParams.get('severity'),
    assetId: searchParams.get('assetId'),
    userId: searchParams.get('userId'),
  };

  let filters: FilterReportInput;
  try {
    filters = filterReportSchema.parse(rawFilters);
  } catch (err) {
    // Default to first page on parse error
    filters = {
      page: 0, // Already 0-indexed by schema
      size: 10,
    };
  }

  const setFilter = (newFilters: Partial<FilterReportInput>) => {
    const params = new URLSearchParams(searchParams);

    if (newFilters.page !== undefined) {
      // Convert back to 1-indexed for URL
      params.set('page', (newFilters.page + 1).toString());
    }
    if (newFilters.size !== undefined) {
      params.set('size', newFilters.size.toString());
    }
    if (newFilters.status !== undefined) {
      if (newFilters.status) {
        params.set('status', newFilters.status);
      } else {
        params.delete('status');
      }
    }
    if (newFilters.severity !== undefined) {
      if (newFilters.severity) {
        params.set('severity', newFilters.severity);
      } else {
        params.delete('severity');
      }
    }
    if (newFilters.assetId !== undefined) {
      if (newFilters.assetId) {
        params.set('assetId', newFilters.assetId);
      } else {
        params.delete('assetId');
      }
    }
    if (newFilters.userId !== undefined) {
      if (newFilters.userId) {
        params.set('userId', newFilters.userId);
      } else {
        params.delete('userId');
      }
    }

    router.replace(`?${params.toString()}`);
  };

  const resetFilters = () => {
    router.replace('?page=1&size=10');
  };

  return { filters, setFilter, resetFilters };
}

/**
 * useConditionReports - Fetch paginated list of reports with filters
 * Used by AdminConditionReportView (Admin/Manager only)
 */
export function useConditionReports(filters: FilterReportInput) {
  return useQuery({
    queryKey: ['condition-reports', filters],
    queryFn: () => fetchConditionReports(filters),
    enabled: true, // Always enabled in the list view
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
}

/**
 * useConditionReport - Fetch a single condition report by ID
 */
export function useConditionReport(id: string) {
  return useQuery({
    queryKey: ['condition-report', id],
    queryFn: () => fetchConditionReport(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    retry: 1,
  });
}

/**
 * useSubmitReport - Mutation for submitting a new condition report
 * Called from ReportIssueForm
 * Invalidates both the reports list and the related asset
 */
export function useSubmitReport(assetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SubmitReportInput) => submitConditionReport(assetId, input),
    onSuccess: () => {
      // Invalidate both queries as per requirements
      queryClient.invalidateQueries({ queryKey: ['condition-reports'] });
      queryClient.invalidateQueries({ queryKey: ['asset', assetId] });
    },
  });
}

/**
 * useResolveReport - Mutation for updating/resolving a condition report
 * Called from ResolveReportModal
 * Invalidates both the reports list and the specific report
 */
export function useResolveReport(reportId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ResolveReportInput) => resolveConditionReport(reportId, input),
    onSuccess: () => {
      // Invalidate both queries as per requirements
      queryClient.invalidateQueries({ queryKey: ['condition-reports'] });
      queryClient.invalidateQueries({ queryKey: ['condition-report', reportId] });
    },
  });
}
