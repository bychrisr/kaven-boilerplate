import { prisma } from '../../../lib/prisma';

export type NotificationType = 'system' | 'user' | 'security' | 'automation' | 'payment';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  actionUrl?: string;
  actionText?: string;
}

export interface NotificationFilters {
  type?: NotificationType;
  priority?: NotificationPriority;
  read?: boolean;
  limit?: number;
}

export class NotificationService {
  /**
   * Criar nova notificação
   */
  async createNotification(data: CreateNotificationData) {
    try {
      const notification = await prisma.inAppNotification.create({
        data: {
          userId: data.userId,
          type: data.type,
          priority: data.priority,
          title: data.title,
          message: data.message,
          metadata: data.metadata || {},
          actionUrl: data.actionUrl,
          actionText: data.actionText,
          read: false,
        },
      });

      console.log('📢 NOTIFICATION SERVICE - Notification created:', {
        id: notification.id,
        userId: data.userId,
        type: data.type,
        priority: data.priority,
      });

      return notification;
    } catch (error) {
      console.error('❌ NOTIFICATION SERVICE - Failed to create notification:', error);
      throw error;
    }
  }

  /**
   * Buscar notificações do usuário com filtros
   */
  async getNotifications(userId: string, filters: NotificationFilters = {}) {
    try {
      const whereClause: any = { userId };

      if (filters.type) {
        whereClause.type = filters.type;
      }

      if (filters.priority) {
        whereClause.priority = filters.priority;
      }

      if (filters.read !== undefined) {
        whereClause.read = filters.read;
      }

      const notifications = await prisma.inAppNotification.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 50,
      });

      return notifications;
    } catch (error) {
      console.error('❌ NOTIFICATION SERVICE - Failed to get notifications:', error);
      throw error;
    }
  }

  /**
   * Contar notificações não lidas
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const count = await prisma.inAppNotification.count({
        where: {
          userId,
          read: false,
        },
      });

      return count;
    } catch (error) {
      console.error('❌ NOTIFICATION SERVICE - Failed to get unread count:', error);
      return 0;
    }
  }

  /**
   * Marcar notificação como lida
   */
  async markAsRead(notificationId: string, userId: string) {
    try {
      const notification = await prisma.inAppNotification.updateMany({
        where: {
          id: notificationId,
          userId, // Segurança: só pode marcar próprias notificações
        },
        data: {
          read: true,
        },
      });

      console.log('✅ NOTIFICATION SERVICE - Notification marked as read:', notificationId);

      return notification;
    } catch (error) {
      console.error('❌ NOTIFICATION SERVICE - Failed to mark as read:', error);
      throw error;
    }
  }

  /**
   * Marcar todas as notificações como lidas
   */
  async markAllAsRead(userId: string) {
    try {
      const result = await prisma.inAppNotification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
        },
      });

      console.log(`✅ NOTIFICATION SERVICE - ${result.count} notifications marked as read for user:`, userId);

      return result;
    } catch (error) {
      console.error('❌ NOTIFICATION SERVICE - Failed to mark all as read:', error);
      throw error;
    }
  }

  /**
   * Deletar notificação
   */
  async deleteNotification(notificationId: string, userId: string) {
    try {
      const notification = await prisma.inAppNotification.deleteMany({
        where: {
          id: notificationId,
          userId, // Segurança: só pode deletar próprias notificações
        },
      });

      console.log('🗑️ NOTIFICATION SERVICE - Notification deleted:', notificationId);

      return notification;
    } catch (error) {
      console.error('❌ NOTIFICATION SERVICE - Failed to delete notification:', error);
      throw error;
    }
  }

  /**
   * Buscar ou criar preferências de notificação do usuário
   */
  async getUserPreferences(userId: string) {
    try {
      let preferences = await prisma.userNotificationPreferences.findUnique({
        where: { userId },
      });

      if (!preferences) {
        // Criar preferências padrão
        preferences = await prisma.userNotificationPreferences.create({
          data: {
            userId,
            inAppEnabled: true,
            emailEnabled: false,
            pushEnabled: false,
          },
        });

        console.log('✅ NOTIFICATION SERVICE - Default preferences created for user:', userId);
      }

      return preferences;
    } catch (error) {
      console.error('❌ NOTIFICATION SERVICE - Failed to get user preferences:', error);
      throw error;
    }
  }

  /**
   * Atualizar preferências de notificação do usuário
   */
  async updateUserPreferences(
    userId: string,
    data: {
      inAppEnabled?: boolean;
      emailEnabled?: boolean;
      pushEnabled?: boolean;
    }
  ) {
    try {
      const preferences = await prisma.userNotificationPreferences.upsert({
        where: { userId },
        update: data,
        create: {
          userId,
          inAppEnabled: data.inAppEnabled ?? true,
          emailEnabled: data.emailEnabled ?? false,
          pushEnabled: data.pushEnabled ?? false,
        },
      });

      console.log('✅ NOTIFICATION SERVICE - User preferences updated:', userId);

      return preferences;
    } catch (error) {
      console.error('❌ NOTIFICATION SERVICE - Failed to update user preferences:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
