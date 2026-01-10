import { FastifyRequest, FastifyReply } from 'fastify';
import {
  notificationService,
  NotificationType,
  NotificationPriority,
  CreateNotificationData,
  NotificationFilters,
} from '../services/notification.service';

export class NotificationController {
  /**
   * GET /api/notifications
   * Listar notificações do usuário com filtros opcionais
   */
  async getNotifications(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.id;
      const query = request.query as {
        type?: NotificationType;
        priority?: NotificationPriority;
        read?: string;
        limit?: string;
      };

      const filters: NotificationFilters = {};

      if (query.type) {
        filters.type = query.type;
      }

      if (query.priority) {
        filters.priority = query.priority;
      }

      if (query.read !== undefined) {
        filters.read = query.read === 'true';
      }

      if (query.limit) {
        filters.limit = Number.parseInt(query.limit, 10);
      }

      const notifications = await notificationService.getNotifications(userId, filters);

      reply.send({
        success: true,
        data: notifications,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      reply.code(500).send({
        success: false,
        error: 'Failed to fetch notifications',
      });
    }
  }

  /**
   * GET /api/notifications/unread-count
   * Contar notificações não lidas
   */
  async getUnreadCount(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.id;

      const count = await notificationService.getUnreadCount(userId);

      reply.send({
        success: true,
        data: { count },
      });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      reply.code(500).send({
        success: false,
        error: 'Failed to fetch unread count',
      });
    }
  }

  /**
   * POST /api/notifications/:id/read
   * Marcar notificação como lida
   */
  async markAsRead(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const userId = (request as any).user.id;
      const { id } = request.params;

      await notificationService.markAsRead(id, userId);

      reply.send({
        success: true,
        message: 'Notification marked as read',
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      reply.code(500).send({
        success: false,
        error: 'Failed to mark notification as read',
      });
    }
  }

  /**
   * POST /api/notifications/read-all
   * Marcar todas as notificações como lidas
   */
  async markAllAsRead(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.id;

      const result = await notificationService.markAllAsRead(userId);

      reply.send({
        success: true,
        message: `${result.count} notifications marked as read`,
        data: { count: result.count },
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      reply.code(500).send({
        success: false,
        error: 'Failed to mark all notifications as read',
      });
    }
  }

  /**
   * DELETE /api/notifications/:id
   * Deletar notificação
   */
  async deleteNotification(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const userId = (request as any).user.id;
      const { id } = request.params;

      await notificationService.deleteNotification(id, userId);

      reply.send({
        success: true,
        message: 'Notification deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      reply.code(500).send({
        success: false,
        error: 'Failed to delete notification',
      });
    }
  }

  /**
   * GET /api/notifications/preferences
   * Buscar preferências de notificação do usuário
   */
  async getPreferences(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.id;

      const preferences = await notificationService.getUserPreferences(userId);

      reply.send({
        success: true,
        data: preferences,
      });
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      reply.code(500).send({
        success: false,
        error: 'Failed to fetch notification preferences',
      });
    }
  }

  /**
   * PUT /api/notifications/preferences
   * Atualizar preferências de notificação do usuário
   */
  async updatePreferences(
    request: FastifyRequest<{
      Body: {
        inAppEnabled?: boolean;
        emailEnabled?: boolean;
        pushEnabled?: boolean;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).user.id;
      const data = request.body;

      const preferences = await notificationService.updateUserPreferences(userId, data);

      reply.send({
        success: true,
        data: preferences,
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      reply.code(500).send({
        success: false,
        error: 'Failed to update notification preferences',
      });
    }
  }
}

// Export singleton instance
export const notificationController = new NotificationController();
