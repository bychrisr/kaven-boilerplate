'use client';

import React from 'react';
import { Bell, User, Shield, Settings, CreditCard, Clock, ExternalLink, Check, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import type { Notification, NotificationType, NotificationPriority } from '../../lib/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
}

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const getTypeIcon = (type: NotificationType) => {
    const icons = {
      system: Settings,
      user: User,
      security: Shield,
      automation: Bell,
      payment: CreditCard,
    };
    const Icon = icons[type];
    return <Icon className="h-4 w-4" />;
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-blue-500',
      high: 'text-orange-500',
      critical: 'text-red-500',
    };
    return colors[priority];
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div
      className={`group relative p-3 rounded-lg transition-all hover:bg-accent/50 cursor-pointer ${
        !notification.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 p-2 rounded-full bg-accent ${getPriorityColor(notification.priority)}`}>
          {getTypeIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
              {notification.title}
            </h4>
            <Badge variant="secondary" className="text-xs">
              {notification.priority}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{notification.message}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatTimestamp(notification.createdAt)}</span>
            </div>

            {notification.actionUrl && (
              <a 
                href={notification.actionUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), "text-xs h-6 px-2")}
              >
                {notification.actionText || 'Ver detalhes'}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
          {!notification.read && (
            <Button variant="ghost" size="sm" onClick={onMarkAsRead} className="h-6 w-6 p-0">
              <Check className="h-3 w-3" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onDelete} className="h-6 w-6 p-0 text-destructive">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {!notification.read && <div className="absolute top-3 right-3 h-2 w-2 bg-primary rounded-full" />}
    </div>
  );
}
