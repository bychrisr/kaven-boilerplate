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
  LucideIcon
} from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  children?: {
    label: string;
    href: string;
    external?: boolean;
  }[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface SpaceConfig {
  id: 'ARCHITECT' | 'FINANCE' | 'SUPPORT' | 'MARKETING' | 'DEVOPS';
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
  ARCHITECT: {
    id: 'ARCHITECT',
    name: 'Admin',
    icon: 'Crown',
    color: 'purple',
    navSections: [
      {
        title: 'OVERVIEW',
        items: [
          { icon: Home, label: 'Dashboard', href: '/dashboard' },
          { icon: BarChart3, label: 'Analytics', href: '/analytics' }
        ]
      },
      {
        title: 'MANAGEMENT',
        items: [
          { icon: Users, label: 'User', href: '/users' },
          { icon: Building2, label: 'Tenant', href: '/tenants' },
          { icon: ShoppingCart, label: 'Order', href: '/orders' },
          { icon: FileText, label: 'Invoice', href: '/invoices' }
        ]
      },
      {
        title: 'MISC',
        items: [
          { icon: Activity, label: 'Monitoring', href: '/monitoring' }
        ]
      }
    ],
    dashboardCards: ['users', 'tenants', 'revenue', 'activity']
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
          { icon: DollarSign, label: 'Revenue', href: '/finance/revenue' },
          { icon: FileText, label: 'Invoices', href: '/invoices' },
          { icon: CreditCard, label: 'Payments', href: '/finance/payments' },
          { icon: Receipt, label: 'Billing', href: '/finance/billing' }
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
          { icon: Headphones, label: 'Tickets', href: '/support/tickets' },
          { icon: UserCheck, label: 'Impersonation', href: '/support/impersonation' },
          { icon: Shield, label: '2FA Reset', href: '/support/2fa-reset' }
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
          { icon: BarChart3, label: 'Analytics', href: '/analytics' },
          { icon: Users, label: 'CRM', href: '/marketing/crm' },
          { icon: Mail, label: 'Campaigns', href: '/marketing/campaigns' },
          { icon: Target, label: 'Goals', href: '/marketing/goals' }
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
          { icon: Home, label: 'Dashboard', href: '/dashboard' }
        ]
      },
      {
        title: 'DEVOPS',
        items: [
          { icon: Activity, label: 'Monitoring', href: '/monitoring' },
          { icon: Server, label: 'Servers', href: '/devops/servers' },
          { icon: Database, label: 'Databases', href: '/devops/databases' },
          { icon: FileText, label: 'Logs', href: '/devops/logs' }
        ]
      }
    ],
    dashboardCards: ['uptime', 'response_time', 'errors', 'cpu_usage']
  }
};
