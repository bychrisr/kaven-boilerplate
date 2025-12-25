// 🎨 UI: Dashboard Page (Dark Glassmorphism)
'use client';

import { useSpaces } from '@/hooks/use-spaces';
import { SPACES } from '@/config/spaces';

import { useUsers } from '@/hooks/use-users';
import { useDashboardSummary, useDashboardCharts } from '@/hooks/use-dashboard';
import { DashboardSkeleton } from '@/components/skeletons/dashboard-skeleton';
import { Users, DollarSign, FileText, ArrowUp, ArrowDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER';
  createdAt: string;
}

const getRoleBadgeClasses = (role: string) => {
  if (role === 'SUPER_ADMIN') return 'bg-destructive/10 text-destructive border border-destructive/20';
  if (role === 'TENANT_ADMIN') return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
  return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const name = payload[0].name;
    // Format value based on context or type (simplified here)
    const formattedValue = typeof value === 'number' 
        ? value.toLocaleString('pt-BR', { style: name === 'revenue' ? 'currency' : 'decimal', currency: 'BRL' })
        : value;

    return (
      <div className="bg-popover border border-border p-3 rounded-lg shadow-xl">
        {label && <p className="text-muted-foreground text-xs mb-1">{label}</p>}
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].fill }}></span>
            <p className="text-popover-foreground font-bold text-sm">
            {name}: {formattedValue}
            </p>
        </div>
      </div>
    );
  }
  return null;
};

const CHART_COLORS = ['hsl(var(--primary))', '#FFAB00', '#00B8D9', '#FF5630'];

export default function DashboardPage() {
  const { data: usersData } = useUsers({ page: 1, limit: 5 });
  const { data: summary, isLoading: isLoadingSummary } = useDashboardSummary();
  const { data: charts, isLoading: isLoadingCharts } = useDashboardCharts();
  const { currentSpace } = useSpaces();

  // ✅ Skeleton loader com tema Glassmorphism
  if (isLoadingSummary || isLoadingCharts) {
    return <DashboardSkeleton />;
  }

  const metrics = summary || {
    totalUsers: 0,
    revenue: 0,
    invoices: 0,
    orders: 0
  };

  const chartData = charts || [];
  const donutData = [
    { name: 'Mac', value: metrics.invoices * 0.4 },
    { name: 'Window', value: metrics.invoices * 0.3 },
    { name: 'iOS', value: metrics.invoices * 0.2 },
    { name: 'Android', value: metrics.invoices * 0.1 },
  ];

  const spaceId = currentSpace?.id || 'ARCHITECT';
  const spaceConfig = SPACES[spaceId];
  
  if (!spaceConfig) return null;

  const showCard = (card: string) => spaceConfig.dashboardCards.includes(card);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold tracking-tight text-foreground">{spaceConfig.name} Dashboard</h1>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Users Card */}
        {showCard('users') && (
            <div className="relative overflow-hidden rounded-2xl bg-card p-6 shadow-xl border border-border/50">
                <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-primary/10 rounded-full">
                        <Users className="h-6 w-6 text-primary" />
                     </div>
                     <span className="text-sm font-bold text-foreground uppercase tracking-wider">Total Active Users</span>
                </div>
                <div className="flex items-end justify-between">
                    <div>
                         <h3 className="text-3xl font-bold text-foreground mb-2">{metrics.totalUsers.toLocaleString()}</h3>
                         <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center text-green-500 font-semibold bg-green-500/10 px-1.5 py-0.5 rounded">
                                <ArrowUp className="h-3 w-3 mr-1" />
                                +2.6%
                            </span>
                            <span className="text-muted-foreground">last 7 days</span>
                         </div>
                    </div>
                     <div className="h-12 w-24">
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={[{v:20},{v:40},{v:30},{v:70},{v:50}]}>
                                 <Bar dataKey="v" fill="hsl(var(--primary))" radius={[2,2,0,0]} />
                             </BarChart>
                         </ResponsiveContainer>
                     </div>
                </div>
            </div>
        )}

        {/* Revenue Card */}
        {showCard('revenue') && (
             <div className="relative overflow-hidden rounded-2xl bg-card p-6 shadow-xl border border-border/50">
                <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-blue-500/10 rounded-full">
                        <DollarSign className="h-6 w-6 text-blue-500" />
                     </div>
                     <span className="text-sm font-bold text-foreground uppercase tracking-wider">Total Revenue</span>
                </div>
                 <div className="flex items-end justify-between">
                    <div>
                         <h3 className="text-3xl font-bold text-foreground mb-2">{metrics.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                         <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center text-green-500 font-semibold bg-green-500/10 px-1.5 py-0.5 rounded">
                                 <ArrowUp className="h-3 w-3 mr-1" />
                                +0.2%
                            </span>
                            <span className="text-muted-foreground">last 7 days</span>
                         </div>
                    </div>
                     <div className="h-12 w-24">
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={[{v:40},{v:20},{v:60},{v:40},{v:80}]}>
                                 <Bar dataKey="v" fill="#00B8D9" radius={[2,2,0,0]} />
                             </BarChart>
                         </ResponsiveContainer>
                     </div>
                </div>
            </div>
        )}

        {/* Invoices/Downloads Card */}
        {showCard('invoices') && (
             <div className="relative overflow-hidden rounded-2xl bg-card p-6 shadow-xl border border-border/50">
                <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-yellow-500/10 rounded-full">
                        <FileText className="h-6 w-6 text-yellow-500" />
                     </div>
                     <span className="text-sm font-bold text-foreground uppercase tracking-wider">Total Invoices</span>
                </div>
                 <div className="flex items-end justify-between">
                    <div>
                         <h3 className="text-3xl font-bold text-foreground mb-2">{metrics.invoices}</h3>
                         <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center text-destructive font-semibold bg-destructive/10 px-1.5 py-0.5 rounded">
                                 <ArrowDown className="h-3 w-3 mr-1" />
                                -0.1%
                            </span>
                            <span className="text-muted-foreground">last 7 days</span>
                         </div>
                    </div>
                      <div className="h-12 w-24">
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={[{v:30},{v:50},{v:40},{v:30},{v:70}]}>
                                 <Bar dataKey="v" fill="#FFAB00" radius={[2,2,0,0]} />
                             </BarChart>
                         </ResponsiveContainer>
                     </div>
                </div>
            </div>
        )}
        
        {/* Placeholder for other cards defined in space but not yet implemented */}
        {spaceConfig.dashboardCards
            .filter(card => !['users', 'revenue', 'invoices'].includes(card))
            .map(card => (
                <div key={card} className="relative overflow-hidden rounded-2xl bg-card p-6 shadow-xl border border-dashed border-border flex flex-col items-center justify-center text-center">
                    <div className="p-3 bg-muted rounded-full mb-3">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground capitalize">{card.replace('_', ' ')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Coming soon for {spaceConfig.name}</p>
                </div>
            ))
        }
      </div>

      {/* Charts Row - Only show for Architect/Admin or specific spaces if mapped */}
      {showCard('activity') && (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Donut Chart */}
            <div className="rounded-2xl bg-card p-6 shadow-xl border border-border/50 lg:col-span-1">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-foreground">Current Activity</h3>
                    <p className="text-sm text-muted-foreground">Activity by type</p>
                </div>
                <div className="h-80 w-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={donutData}
                                innerRadius={80}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {donutData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Stacked Bar Chart */}
            <div className="rounded-2xl bg-card p-6 shadow-xl border border-border/50 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Activity Trends</h3>
                        <p className="text-sm text-muted-foreground">(+43%) than last year</p>
                    </div>
                </div>
                <div className="h-80 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barSize={12}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#919EAB33" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#919EAB'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#919EAB'}} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="users" stackId="a" fill="#00A76F" radius={[0,0,0,0]} />
                            <Bar dataKey="revenue" stackId="a" fill="#FFAB00" radius={[4,4,0,0]} /> 
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      )}

      {/* User Table - Only show if users card is active or explicit */}
      {showCard('users') && (
        <div className="rounded-2xl bg-card shadow-xl border border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border/50">
                <h3 className="text-lg font-bold text-foreground">Active Users</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border/50">
                    <thead className="bg-muted/50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 bg-card">
                    {usersData?.users.map((user: User) => (
                        <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground font-bold text-sm">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-medium text-foreground">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${getRoleBadgeClasses(user.role)}`}>
                            {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
}
