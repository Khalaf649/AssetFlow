'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { useAuth } from '@/app/auth/context/AuthContext';
import { DeveloperReportsList } from './DeveloperReportsList';

/**
 * DeveloperConditionReportView - Dashboard for developers
 * Shows only their own reports and allows them to submit new ones
 */
export function DeveloperConditionReportView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-reports');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <h1 className="text-2xl font-semibold">My Condition Reports</h1>
      </div>

      {/* Tabs for navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-reports">My Reports</TabsTrigger>
          <TabsTrigger value="instructions">How to Report</TabsTrigger>
        </TabsList>

        {/* My Reports Tab */}
        <TabsContent value="my-reports" className="space-y-4">
          <DeveloperReportsList userId={user?.id || ''} />
        </TabsContent>

        {/* Instructions Tab */}
        <TabsContent value="instructions" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">How to Report a Hardware Issue</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Navigate to your assigned assets in the Assets section</li>
                <li>Select an asset and click "Report Issue"</li>
                <li>Describe the problem in detail (at least 10 characters)</li>
                <li>Indicate the severity level (LOW, MEDIUM, or HIGH)</li>
                <li>Submit the report for review by administrators</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Severity Guidelines</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-medium">LOW:</span> Minor issues that don't prevent normal use
                </li>
                <li>
                  <span className="font-medium">MEDIUM:</span> Issues that impact functionality but device is still usable
                </li>
                <li>
                  <span className="font-medium">HIGH:</span> Critical issues that prevent the device from being used
                </li>
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
