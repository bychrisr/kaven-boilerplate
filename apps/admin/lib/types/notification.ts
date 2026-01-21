export type NotificationType = 'system' | 'user' | 'security' | 'automation' | 'payment';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: Date;
}

export interface NotificationFilters {
  type?: NotificationType;
  priority?: NotificationPriority;
  read?: boolean;
  limit?: number;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

export interface UserNotificationPreferences {
  id: string;
  userId: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
