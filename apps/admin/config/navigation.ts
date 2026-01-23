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
  Mail, 
  Target, 
  Server, 
  Activity, 
  Database, 
  Settings, 
  Book, 
  Coins, 
  Lock,
  ShieldCheck,
  LucideIcon
} from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  requiredCapability?: string;
  children?: {
    label: string;
    href: string;
    external?: boolean;
    requiredCapability?: string;
  }[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/**
 * LISTA MESTRE DE NAVEGAÇÃO
 * A UI filtrará esta lista baseada nas Capabilities reais do usuário no Space atual.
 */
export const MASTER_NAVIGATION: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { icon: Home, label: 'Dashboard', href: '/dashboard' },
      { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics', requiredCapability: 'analytics.view' },
      { icon: Settings, label: 'Platform Settings', href: '/saas-settings', requiredCapability: 'platform.settings.manage' }
    ]
  },
  {
    title: 'MANAGEMENT',
    items: [
      { icon: Users, label: 'Users', href: '/users', requiredCapability: 'users.read' },
      { icon: Shield, label: 'Roles', href: '/roles', requiredCapability: 'roles.read' },
      { icon: ShieldCheck, label: 'Policies', href: '/policies', requiredCapability: 'policies.read' },
      { icon: Lock, label: 'Data Masking', href: '/security/masking', requiredCapability: 'policies.read' },
      { icon: Mail, label: 'Invites', href: '/invites', requiredCapability: 'invites.manage' },
      { icon: Lock, label: 'Access Requests', href: '/access-requests', requiredCapability: 'access_requests.read' },
      { icon: Building2, label: 'Tenant', href: '/tenants', requiredCapability: 'tenants.read' }
    ]
  },
  {
    title: 'FINANCE',
    items: [
      { icon: DollarSign, label: 'Revenue', href: '/coming-soon', requiredCapability: 'revenue.view' },
      { icon: ShoppingCart, label: 'Orders', href: '/orders', requiredCapability: 'orders.read' },
      { icon: FileText, label: 'Invoices', href: '/invoices', requiredCapability: 'invoices.read' },
      { icon: CreditCard, label: 'Payments', href: '/coming-soon', requiredCapability: 'payments.read' },
      { icon: Receipt, label: 'Billing', href: '/coming-soon', requiredCapability: 'billing.read' },
      { icon: Coins, label: 'Currencies', href: '/currencies', requiredCapability: 'currencies.read' }
    ]
  },
  {
    title: 'MONETIZATION',
    items: [
      { icon: CreditCard, label: 'Plans', href: '/plans', requiredCapability: 'plans.view' },
      { icon: ShoppingCart, label: 'Products', href: '/products', requiredCapability: 'products.read' },
      { icon: Target, label: 'Features', href: '/features', requiredCapability: 'features.read' },
      { icon: Receipt, label: 'Subscriptions', href: '/subscriptions', requiredCapability: 'subscriptions.read' }
    ]
  },
  {
    title: 'SUPPORT',
    items: [
      { icon: Headphones, label: 'Tickets', href: '/coming-soon', requiredCapability: 'tickets.read' },
      { icon: UserCheck, label: 'Impersonation', href: '/coming-soon', requiredCapability: 'impersonation.start' },
      { icon: Shield, label: '2FA Reset', href: '/security/2fa-reset', requiredCapability: 'auth.2fa_reset.request' }
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
           { label: 'Dashboard', href: '/observability', requiredCapability: 'observability.view_metrics' },
           { label: 'Audit Logs', href: '/audit-logs', requiredCapability: 'logs.read' },
           { label: 'Grafana', href: 'http://localhost:3001', external: true, requiredCapability: 'grafana.open' },
           { label: 'Prometheus', href: 'http://localhost:9090', external: true, requiredCapability: 'prometheus.open' }
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
        href: '#',
        children: [
          { label: 'Platform Wiki', href: '/docs/platform', external: true },
          { label: 'Design System', href: '/docs/design-system', external: true }
        ]
      }
    ]
  }
];
