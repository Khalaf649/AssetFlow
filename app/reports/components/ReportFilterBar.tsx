'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function ReportFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'overview';

  const tabs = [
    { key: 'overview', label: 'Overview'           },
    { key: 'usage',    label: 'Usage Statistics'   },
    { key: 'warranty', label: 'Warranty Expiry'    },
  ];

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    params.delete('from');
    params.delete('to');
    params.delete('daysAhead');
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="flex gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className={`px-4 py-2 text-sm border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}