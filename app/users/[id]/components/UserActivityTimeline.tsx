"use client";

import { Card } from "@/src/components/ui/card";

interface UserActivityTimelineProps {
  createdAt: string;
}

export function UserActivityTimeline({ createdAt }: UserActivityTimelineProps) {
  return (
    <Card className="bg-card border-border p-8">
      <h2 className="text-xl font-bold mb-6">Activity</h2>
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="w-3 h-3 rounded-full bg-primary mt-1.5" />
          <div>
            <p className="font-semibold">Account created</p>
            <p className="text-sm text-muted-foreground">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
