"use client";

import { Card } from "@/src/components/ui/card";

interface UserActivityTimelineProps {
  createdAt: string;
  role?: "ADMIN" | "MANAGER" | "DEVELOPER";
}

export function UserActivityTimeline({
  createdAt,
  role,
}: UserActivityTimelineProps) {
  const date = new Date(createdAt).toLocaleDateString("en-CA"); // YYYY-MM-DD

  const events = [
    { label: "Account created", date },
    ...(role ? [{ label: `Role assigned: ${role}`, date }] : []),
  ];

  return (
    <Card className="bg-card border-border p-6 h-full">
      <h2 className="text-base font-semibold mb-4">Activity</h2>
      <div className="space-y-4">
        {events.map((event, i) => (
          <div key={i}>
            <p className="text-sm font-medium">{event.label}</p>
            <p className="text-xs text-muted-foreground">{event.date}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
