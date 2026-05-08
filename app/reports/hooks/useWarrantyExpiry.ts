import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { fetchWarrantyExpiry } from '../api/reports-api';

export function useWarrantyExpiry() {
  const searchParams = useSearchParams();
  const daysAhead = Number(searchParams.get('daysAhead') ?? 30);

  return useQuery({
    queryKey: ['reports', 'warranty-expiry', daysAhead],
    queryFn: () => fetchWarrantyExpiry(daysAhead),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}