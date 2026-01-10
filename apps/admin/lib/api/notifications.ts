import { api } from '../api';
import type {
  Notification,
  NotificationFilters,
  UserNotificationPreferences,
} from '../types/notification';

export const notificationsApi = {
  /**
   * Buscar notificações do usuário
   */
  async getNotifications(filters?: NotificationFilters): Promise<Notification[]> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.read !== undefined) params.append('read', String(filters.read));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await api.get(`/api/notifications?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Buscar contagem de notificações não lidas
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/api/notifications/unread-count');
    return response.data.data.count;
  },

  /**
   * Marcar notificação como lida
   */
  async markAsRead(notificationId: string): Promise<void> {
    await api.post(`/api/notifications/${notificationId}/read`);
  },

  /**
   * Marcar todas as notificações como lidas
   */
  async markAllAsRead(): Promise<{ count: number }> {
    const response = await api.post('/api/notifications/read-all');
    return response.data.data;
  },

  /**
   * Deletar notificação
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/api/notifications/${notificationId}`);
  },

  /**
   * Buscar preferências de notificação do usuário
   */
  async getPreferences(): Promise<UserNotificationPreferences> {
    const response = await api.get('/api/notifications/preferences');
    return response.data.data;
  },

  /**
   * Atualizar preferências de notificação do usuário
   */
  async updatePreferences(data: {
    inAppEnabled?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
  }): Promise<UserNotificationPreferences> {
    const response = await api.put('/api/notifications/preferences', data);
    return response.data.data;
  },
};
