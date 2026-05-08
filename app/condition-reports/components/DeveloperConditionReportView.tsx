'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { useAuth } from '@/app/auth/context/AuthContext';
import { DeveloperReportsList } from './DeveloperReportsList';
import { SeverityBadge } from './Badges';

export function DeveloperConditionReportView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-reports');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-orange-500" />
        Condition Reports
      </h1>

      {/* Tabs — underline style matching the admin view */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent border-b border-gray-200 rounded-none p-0 h-auto gap-0 w-full justify-start">
          {[
            { value: 'my-reports',    label: 'My Reports'    },
            { value: 'instructions',  label: 'How to Report' },
          ].map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm text-gray-500
                         data-[state=active]:border-blue-500 data-[state=active]:text-blue-600
                         data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* My Reports Tab */}
        <TabsContent value="my-reports" className="mt-6">
          <DeveloperReportsList userId={user?.id || ''} />
        </TabsContent>

        {/* Instructions Tab */}
        <TabsContent value="instructions" className="mt-6">
          <Card className="p-6 space-y-6 border-gray-200">

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">How to Report a Hardware Issue</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Navigate to your assigned assets in the Assets section</li>
                <li>Select an asset and click "Report Issue"</li>
                <li>Describe the problem in detail (at least 10 characters)</li>
                <li>Indicate the severity level (LOW, MEDIUM, or HIGH)</li>
                <li>Submit the report for review by administrators</li>
              </ol>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Severity Guidelines</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <SeverityBadge severity="LOW" />
                  <span>Minor issues that don't prevent normal use</span>
                </li>
                <li className="flex items-start gap-3">
                  <SeverityBadge severity="MEDIUM" />
                  <span>Issues that impact functionality but device is still usable</span>
                </li>
                <li className="flex items-start gap-3">
                  <SeverityBadge severity="HIGH" />
                  <span>Critical issues that prevent the device from being used</span>
                </li>
              </ul>
            </div>

          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}