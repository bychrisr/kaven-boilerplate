'use client';

import React, { useState } from 'react';
import { Bell, Check, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectOption } from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useNotifications } from '../../contexts/notification-context';
import { NotificationItem } from './notification-item';
import type { NotificationType, NotificationPriority } from '../../lib/types/notification';

export function NotificationDropdown() {
  const { state, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<NotificationPriority | 'all'>('all');

  const filteredNotifications = state.notifications.filter((notification) => {
    if (filterType !== 'all' && notification.type !== filterType) return false;
    if (filterPriority !== 'all' && notification.priority !== filterPriority) return false;
    return true;
  });

  const groupedNotifications = filteredNotifications.reduce((acc, notification) => {
    const type = notification.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(notification);
    return acc;
  }, {} as Record<NotificationType, typeof filteredNotifications>);

  const getTypeLabel = (type: NotificationType) => {
    const labels = {
      automation: 'Automações',
      user: 'Usuário',
      system: 'Sistema',
      security: 'Segurança',
      payment: 'Pagamentos',
    };
    return labels[type];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {state.unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold px-1">
              {state.unreadCount > 99 ? '99+' : state.unreadCount}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-96" align="end">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Notificações</h3>
            <div className="flex items-center space-x-2">
              {state.unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Marcar todas como lidas
                </Button>
              )}
              <Button variant="ghost" size="sm" className="text-xs">
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex space-x-2">
            <Select 
              value={filterType} 
              onChange={(value) => setFilterType(value as NotificationType | 'all')}
              placeholder="Tipo"
              size="sm"
            >
              <SelectOption value="all">Todos os tipos</SelectOption>
              <SelectOption value="automation">Automações</SelectOption>
              <SelectOption value="user">Usuário</SelectOption>
              <SelectOption value="system">Sistema</SelectOption>
              <SelectOption value="security">Segurança</SelectOption>
              <SelectOption value="payment">Pagamentos</SelectOption>
            </Select>

            <Select 
              value={filterPriority} 
              onChange={(value) => setFilterPriority(value as NotificationPriority | 'all')}
              placeholder="Prioridade"
              size="sm"
            >
              <SelectOption value="all">Todas as prioridades</SelectOption>
              <SelectOption value="low">Baixa</SelectOption>
              <SelectOption value="medium">Média</SelectOption>
              <SelectOption value="high">Alta</SelectOption>
              <SelectOption value="critical">Crítica</SelectOption>
            </Select>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {state.isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2" />
              Carregando notificações...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação encontrada</p>
              <p className="text-xs mt-1">
                {filterType !== 'all' || filterPriority !== 'all' ? 'Tente ajustar os filtros' : 'Você está em dia!'}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {Object.entries(groupedNotifications).map(([type, notifications]) => (
                <div key={type} className="mb-4">
                  <div className="flex items-center justify-between mb-2 px-2">
                    <h4 className="text-sm font-medium">{getTypeLabel(type as NotificationType)}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {notifications.length}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={() => markAsRead(notification.id)}
                        onDelete={() => deleteNotification(notification.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
