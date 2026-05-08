'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWarrantyExpiry } from '../hooks/useWarrantyExpiry';
import { WarrantyAsset } from '../api/reports-api';

const ACTION_STYLES: Record<WarrantyAsset['suggestedAction'], string> = {
  REASSIGN_AS_SPARE: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  DECOMMISSION: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  RENEW_WARRANTY: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
};

const ACTION_LABELS: Record<WarrantyAsset['suggestedAction'], string> = {
  REASSIGN_AS_SPARE: 'Reassign as Spare',
  DECOMMISSION: 'Decommission',
  RENEW_WARRANTY: 'Renew Warranty',
};

export function WarrantyExpiryView() {
  const { data, isLoading, error } = useWarrantyExpiry();
  const router = useRouter();
  const searchParams = useSearchParams();
  const daysAhead = searchParams.get('daysAhead') ?? '30';

  const setDaysAhead = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('daysAhead', value);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground">Show next</label>
        <select
          value={daysAhead}
          onChange={(e) => setDaysAhead(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          {[7, 14, 30, 60, 90].map((d) => (
            <option key={d} value={d}>{d} days</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          Failed to load warranty data.
        </div>
      )}

      {data && data.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">No expiring warranties</p>
          <p className="mt-1 text-sm text-muted-foreground">No assets expiring in the next {daysAhead} days.</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Asset</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Serial No.</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Expiry Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Days Until Expiry</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Suggested Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((asset) => (
                <tr key={asset.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/assets/${asset.id}`} className="font-medium text-primary hover:underline">
                      {asset.brand} {asset.model}
                    </Link>
                    <p className="text-xs text-muted-foreground capitalize">{asset.type.toLowerCase()}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{asset.serialNumber}</td>
                  <td className="px-4 py-3 text-foreground">
                    {new Date(asset.warrantyExpirationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${asset.daysUntilExpiry <= 0 ? 'text-red-600 dark:text-red-400' : asset.daysUntilExpiry <= 14 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>
                      {asset.daysUntilExpiry <= 0 ? `Expired ${Math.abs(asset.daysUntilExpiry)}d ago` : `${asset.daysUntilExpiry}d`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium border ${ACTION_STYLES[asset.suggestedAction]}`}>
                      {ACTION_LABELS[asset.suggestedAction]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}