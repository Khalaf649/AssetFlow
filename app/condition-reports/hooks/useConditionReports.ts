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
  SubmitReportInput,
  ResolveReportInput,
  ReportStatus,
} from '../schemas/condition-report-schemas';

export function useReportFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTabState] = useState<string>('all');

  const rawFilters = {
    page:     searchParams.get('page')     || '1',
    size:     searchParams.get('size')     || '10',
    status:   searchParams.get('status')   ?? undefined,
    severity: searchParams.get('severity') ?? undefined,
    assetId:  searchParams.get('assetId')  ?? undefined,
    userId:   searchParams.get('userId')   ?? undefined,
  };

  let filters: FilterReportInput;
  try {
    filters = filterReportSchema.parse(rawFilters);
  } catch {
    filters = { page: 0, size: 10 };
  }

  const setFilter = (newFilters: Partial<FilterReportInput>) => {
    const params = new URLSearchParams(searchParams.toString());

    const updates: Record<string, string | undefined> = {
      ...(newFilters.page     !== undefined && { page: (newFilters.page + 1).toString() }),
      ...(newFilters.size     !== undefined && { size: newFilters.size.toString() }),
      ...(newFilters.status   !== undefined && { status: newFilters.status }),
      ...(newFilters.severity !== undefined && { severity: newFilters.severity }),
      ...(newFilters.assetId  !== undefined && { assetId: newFilters.assetId }),
      ...(newFilters.userId   !== undefined && { userId: newFilters.userId }),
    };

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.replace(`?${params.toString()}`);
  };

  const resetFilters = () => {
    router.replace('?page=1&size=10');
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');

    if (tab === 'all') {
      params.delete('status');
    } else {
      params.set('status', tab as ReportStatus);
    }

    router.replace(`?${params.toString()}`);
  };

  return { filters, setFilter, resetFilters, activeTab, setActiveTab };
}

export function useConditionReports(filters?: FilterReportInput) {
  const queryFilters = filters ?? { page: 0, size: 10 };

  return useQuery({
    queryKey: ['condition-reports', queryFilters],
    queryFn:  () => fetchConditionReports(queryFilters),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useConditionReport(id: string) {
  return useQuery({
    queryKey: ['condition-report', id],
    queryFn:  () => fetchConditionReport(id),
    enabled:  !!id,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useSubmitReport(assetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SubmitReportInput) => submitConditionReport(assetId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['condition-reports'] });
      queryClient.invalidateQueries({ queryKey: ['asset', assetId] });
    },
  });
}

export function useResolveReport(reportId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ResolveReportInput) => resolveConditionReport(reportId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['condition-reports'] });
      queryClient.invalidateQueries({ queryKey: ['condition-report', reportId] });
    },
  });
}