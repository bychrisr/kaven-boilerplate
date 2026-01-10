import { FastifyInstance } from 'fastify';
import { notificationController } from '../controllers/notification.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';

export async function notificationRoutes(fastify: FastifyInstance) {
  // Aplicar autenticação em todas as rotas
  fastify.addHook('onRequest', authMiddleware);


  // GET /api/notifications - Listar notificações
  fastify.get('/', notificationController.getNotifications.bind(notificationController));

  // GET /api/notifications/unread-count - Contar não lidas
  fastify.get('/unread-count', notificationController.getUnreadCount.bind(notificationController));

  // POST /api/notifications/:id/read - Marcar como lida
  fastify.post('/:id/read', notificationController.markAsRead.bind(notificationController));

  // POST /api/notifications/read-all - Marcar todas como lidas
  fastify.post('/read-all', notificationController.markAllAsRead.bind(notificationController));

  // DELETE /api/notifications/:id - Deletar notificação
  fastify.delete('/:id', notificationController.deleteNotification.bind(notificationController));

  // GET /api/notifications/preferences - Buscar preferências
  fastify.get('/preferences', notificationController.getPreferences.bind(notificationController));

  // PUT /api/notifications/preferences - Atualizar preferências
  fastify.put('/preferences', notificationController.updatePreferences.bind(notificationController));

  console.log('✅ Notification routes registered');
}
