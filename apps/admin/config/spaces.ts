import { 
  Home, 
  Users, 
  Building2, 
  ShoppingCart, 
  FileText, 
  BarChart3,
  DollarSign,
  CreditCard,
  Receipt,
  Headphones,
  UserCheck,
  Shield,
  // TrendingUp,
  Mail,
  Target,
  Server,
  Activity,
  Database,
  Settings,
  Book,
  Coins,
  LucideIcon
} from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  requiredCapability?: string; // ← NOVO
  children?: {
    label: string;
    href: string;
    external?: boolean;
    requiredCapability?: string; // ← NOVO
  }[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface SpaceConfig {
  id: 'ADMIN' | 'FINANCE' | 'SUPPORT' | 'MARKETING' | 'DEVOPS';
  name: string;
  icon: string;
  color: string;
  navSections: NavSection[];
  dashboardCards: string[];
}

/**
 * Configuração de cada Space (Workspace)
 */
export const SPACES: Record<string, SpaceConfig> = {
  ADMIN: {
    id: 'ADMIN',
    name: 'Admin',
    icon: 'Crown',
    color: 'purple',
    navSections: [
      {
        title: 'OVERVIEW',
        items: [
          { icon: Home, label: 'Dashboard', href: '/dashboard' },
          { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
          { icon: Settings, label: 'Platform Settings', href: '/saas-settings' }
        ]
      },
      {
        title: 'MANAGEMENT',
        items: [
          { icon: Users, label: 'Users', href: '/users', requiredCapability: 'users.read' },
          { icon: Mail, label: 'Invites', href: '/invites', requiredCapability: 'invites.manage' },
          { icon: Building2, label: 'Tenant', href: '/tenants', requiredCapability: 'tenants.read' }
        ]
      },
      {
        title: 'FINANCE',
        items: [
          { icon: DollarSign, label: 'Revenue', href: '/coming-soon', requiredCapability: 'revenue.view' },
          { icon: ShoppingCart, label: 'Orders', href: '/orders', requiredCapability: 'orders.view' },
          { icon: FileText, label: 'Invoices', href: '/invoices', requiredCapability: 'invoices.view' },
          { icon: CreditCard, label: 'Payments', href: '/coming-soon', requiredCapability: 'payments.view' },
          { icon: Receipt, label: 'Billing', href: '/coming-soon', requiredCapability: 'billing.view' }
        ]
      },
      {
        title: 'MONETIZATION',
        items: [
          { icon: CreditCard, label: 'Plans', href: '/plans', requiredCapability: 'plans.view' },
          { icon: ShoppingCart, label: 'Products', href: '/products', requiredCapability: 'products.read' },
          { icon: Target, label: 'Features', href: '/features', requiredCapability: 'features.read' },
          { icon: Receipt, label: 'Subscriptions', href: '/subscriptions', requiredCapability: 'subscriptions.read' },
          { icon: Coins, label: 'Currencies', href: '/currencies', requiredCapability: 'currencies.read' }
        ]
      },
      {
        title: 'SUPPORT',
        items: [
          { icon: Headphones, label: 'Tickets', href: '/coming-soon', requiredCapability: 'tickets.read' },
          { icon: UserCheck, label: 'Impersonation', href: '/coming-soon', requiredCapability: 'impersonation.start' },
          { icon: Shield, label: '2FA Reset', href: '/coming-soon', requiredCapability: 'auth.2fa_reset.request' }
        ]
      },
      {
        title: 'MARKETING',
        items: [
          { icon: Users, label: 'CRM', href: '/coming-soon', requiredCapability: 'crm.read' },
          { icon: Mail, label: 'Campaigns', href: '/coming-soon', requiredCapability: 'campaigns.read' },
          { icon: Target, label: 'Goals', href: '/coming-soon', requiredCapability: 'goals.view' }
        ]
      },
      {
        title: 'DEVOPS',
        items: [
          { 
            icon: Activity, 
            label: 'Monitoring', 
            href: '#',
            requiredCapability: 'observability.view_metrics',
            children: [
               { label: 'Dashboard', href: '/observability' },
               { label: 'Audit Logs', href: '/audit-logs', requiredCapability: 'logs.read' },
               { label: 'Grafana', href: process.env.NEXT_PUBLIC_GRAFANA_URL || 'http://localhost:3001', external: true, requiredCapability: 'grafana.open' },
               { label: 'Prometheus', href: process.env.NEXT_PUBLIC_PROMETHEUS_URL || 'http://localhost:9090', external: true, requiredCapability: 'prometheus.open' }
            ]
          },
          { icon: Server, label: 'Servers', href: '/dashboard/analytics', requiredCapability: 'server.view' },
          { icon: Database, label: 'Databases', href: '/dashboard/analytics', requiredCapability: 'database.view' },
          { icon: FileText, label: 'Logs', href: '/audit-logs', requiredCapability: 'logs.read' }
        ]
      },
      {
        title: 'RESOURCES',
        items: [
          { 
            icon: Book, 
            label: 'Documentation', 
            href: process.env.NEXT_PUBLIC_DOCS_URL || 'http://localhost:3002',
            children: [
              { label: 'Platform Wiki', href: `${process.env.NEXT_PUBLIC_DOCS_URL || 'http://localhost:3002'}/platform`, external: true },
              { label: 'Design System', href: `${process.env.NEXT_PUBLIC_DOCS_URL || 'http://localhost:3002'}/design-system`, external: true }
            ]
          }
        ]
      }
    ],
    dashboardCards: [
        'users', 'tenants', 'revenue', 'activity',
        'invoices', 'payments', 'mrr',
        'tickets', 'response_time', 'satisfaction', 'active_users',
        'conversions', 'campaigns', 'leads', 'engagement',
        'uptime', 'errors', 'cpu_usage'
    ]
  },
  
  FINANCE: {
    id: 'FINANCE',
    name: 'Finance',
    icon: 'DollarSign',
    color: 'green',
    navSections: [
      {
        title: 'OVERVIEW',
        items: [
          { icon: Home, label: 'Dashboard', href: '/dashboard' }
        ]
      },
      {
        title: 'FINANCE',
        items: [
          { icon: DollarSign, label: 'Revenue', href: '/coming-soon' },
          { icon: ShoppingCart, label: 'Orders', href: '/orders' },
          { icon: FileText, label: 'Invoices', href: '/invoices' },
          { icon: CreditCard, label: 'Payments', href: '/coming-soon' },
          { icon: Receipt, label: 'Billing', href: '/coming-soon' }
        ]
      }
    ],
    dashboardCards: ['revenue', 'invoices', 'payments', 'mrr']
  },
  
  SUPPORT: {
    id: 'SUPPORT',
    name: 'Support',
    icon: 'Headphones',
    color: 'blue',
    navSections: [
      {
        title: 'OVERVIEW',
        items: [
          { icon: Home, label: 'Dashboard', href: '/dashboard' }
        ]
      },
      {
        title: 'SUPPORT',
        items: [
          { icon: Headphones, label: 'Tickets', href: '/coming-soon' },
          { icon: UserCheck, label: 'Impersonation', href: '/coming-soon' },
          { icon: Shield, label: '2FA Reset', href: '/coming-soon' }
        ]
      }
    ],
    dashboardCards: ['tickets', 'response_time', 'satisfaction', 'active_users']
  },
  
  MARKETING: {
    id: 'MARKETING',
    name: 'Marketing',
    icon: 'TrendingUp',
    color: 'orange',
    navSections: [
      {
        title: 'OVERVIEW',
        items: [
          { icon: Home, label: 'Dashboard', href: '/dashboard' }
        ]
      },
      {
        title: 'MARKETING',
        items: [
          { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
          { icon: Users, label: 'CRM', href: '/coming-soon' },
          { icon: Mail, label: 'Campaigns', href: '/coming-soon' },
          { icon: Target, label: 'Goals', href: '/coming-soon' }
        ]
      }
    ],
    dashboardCards: ['conversions', 'campaigns', 'leads', 'engagement']
  },
  
  DEVOPS: {
    id: 'DEVOPS',
    name: 'DevOps',
    icon: 'Server',
    color: 'red',
    navSections: [
      {
        title: 'OVERVIEW',
        items: [
          { icon: Home, label: 'Dashboard', href: '/dashboard' },
          { icon: Settings, label: 'Platform Settings', href: '/saas-settings' }
        ]
      },
      {
        title: 'DEVOPS',
        items: [
          { 
            icon: Activity, 
            label: 'Monitoring', 
            href: '#',
            children: [
               { label: 'Dashboard', href: '/observability' },
               { label: 'Audit Logs', href: '/audit-logs' },
               { label: 'Grafana', href: 'http://localhost:3001', external: true },
               { label: 'Prometheus', href: 'http://localhost:9090', external: true }
            ]
          },
          { icon: Server, label: 'Servers', href: '/dashboard/analytics' },
          { icon: Database, label: 'Databases', href: '/dashboard/analytics' },
          { icon: FileText, label: 'Logs', href: '/audit-logs' }
        ]
      }
    ],
    dashboardCards: ['uptime', 'response_time', 'errors', 'cpu_usage']
  }
};
