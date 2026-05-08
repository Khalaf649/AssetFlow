'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function ReportFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'overview';

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'usage', label: 'Usage Statistics' },
    { key: 'warranty', label: 'Warranty Expiry' },
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
    <div className="border-b border-border">
      <nav className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}