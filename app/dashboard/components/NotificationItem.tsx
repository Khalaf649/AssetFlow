"use client";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
}

interface NotificationItemProps {
  notification: Notification;
  onNotificationClick: (notificationId: string) => void;
}

export function NotificationItem({
  notification,
  onNotificationClick,
}: NotificationItemProps) {
  return (
    <li
      onClick={() => onNotificationClick(notification.id)}
      className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
        !notification.read ? "bg-accent/5 border-l-2 border-l-accent" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            {notification.type}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {notification.message}
          </p>
        </div>
        {!notification.read && (
          <div className="h-2 w-2 rounded-full bg-accent mt-1 ml-2 shrink-0" />
        )}
      </div>
    </li>
  );
}
