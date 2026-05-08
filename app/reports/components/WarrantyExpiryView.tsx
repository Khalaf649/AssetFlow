'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWarrantyExpiry } from '../hooks/useWarrantyExpiry';
import { WarrantyAsset } from '../api/reports-api';

const ACTION_STYLES: Record<WarrantyAsset['suggestedAction'], string> = {
  REASSIGN_AS_SPARE: 'bg-blue-50 text-blue-700 border-blue-200',
  DECOMMISSION:      'bg-red-50 text-red-600 border-red-200',
  RENEW_WARRANTY:    'bg-green-50 text-green-700 border-green-200',
};

const ACTION_LABELS: Record<WarrantyAsset['suggestedAction'], string> = {
  REASSIGN_AS_SPARE: 'Reassign as Spare',
  DECOMMISSION:      'Decommission',
  RENEW_WARRANTY:    'Renew Warranty',
};

export function WarrantyExpiryView() {
  const { data, isLoading, error } = useWarrantyExpiry();
  const router = useRouter();
  const searchParams = useSearchParams();
  const daysAhead = searchParams.get('daysAhead') ?? '60';

  const setDaysAhead = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('daysAhead', value);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">

      {/* Filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-500">Show next</label>
        <select
          value={daysAhead}
          onChange={(e) => setDaysAhead(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
        >
          {[7, 14, 30, 60, 90].map((d) => (
            <option key={d} value={d}>{d} days</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load warranty data.
        </div>
      )}

      {data && data.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
          <p className="text-sm font-medium text-gray-700">No expiring warranties</p>
          <p className="mt-1 text-sm text-gray-400">No assets expiring in the next {daysAhead} days.</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">

          {/* Section header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">Warranty Expiring Soon</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Assets within {daysAhead} days of warranty expiration.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Asset</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Serial</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Warranty</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Days Left</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Assigned To</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Suggested Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/assets/${asset.id}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {asset.brand} {asset.model}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {asset.serialNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(asset.warrantyExpirationDate).toISOString().slice(0, 10)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${
                        asset.daysUntilExpiry <= 0
                          ? 'text-red-500'
                          : asset.daysUntilExpiry <= 14
                          ? 'text-orange-500'
                          : 'text-gray-700'
                      }`}>
                        {asset.daysUntilExpiry <= 0
                          ? 'Expired'
                          : `${asset.daysUntilExpiry}d`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-0.5 text-xs font-semibold border ${ACTION_STYLES[asset.suggestedAction]}`}>
                        {ACTION_LABELS[asset.suggestedAction]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}