"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "../hooks/useDashboardHooks";
import { useMarkNotificationReadMutation } from "../hooks/useMarkNotificationReadMutation";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { NotificationItem } from "./NotificationItem";

export function NotificationBell() {
  const { data } = useNotifications();

  const markReadMutation = useMarkNotificationReadMutation();

  const unreadCount = data?.items.filter((n) => !n.read).length || 0;

  const handleNotificationClick = (notificationId: string) => {
    markReadMutation.mutate(notificationId);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="px-4 py-3 border-b border-border bg-muted/50">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
        </div>
        <ul className="max-h-80 overflow-auto divide-y divide-border">
          {data?.items && data.items.length > 0 ? (
            data.items.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onNotificationClick={handleNotificationClick}
              />
            ))
          ) : (
            <li className="p-4 text-center text-xs text-muted-foreground">
              No notifications
            </li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
