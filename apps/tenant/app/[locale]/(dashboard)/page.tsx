'use client';

import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/auth.store';
import { useTenant } from '@/lib/hooks/use-tenant';
import { useSpace } from '@/lib/hooks/use-space';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderKanban, CheckSquare, HardDrive } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function TenantDashboard() {
  // const t = useTranslations('Dashboard');
  const { user } = useAuthStore();
  const { tenant } = useTenant();
  const { activeSpace } = useSpace();

  // Mock Data based on Space
  const stats = [
    { label: 'Team Members', value: '12', icon: Users, change: '+2 this week' },
    { label: 'Active Projects', value: '5', icon: FolderKanban, change: '1 completed' },
    { label: 'Pending Tasks', value: '34', icon: CheckSquare, change: '-5 from yesterday' },
    { label: 'Storage', value: '45 GB', icon: HardDrive, change: '15 GB remaining' },
  ];

  const data = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 200 },
    { name: 'Thu', value: 278 },
    { name: 'Fri', value: 189 },
    { name: 'Sat', value: 239 },
    { name: 'Sun', value: 349 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening in your <span className="font-semibold text-primary">{tenant?.name}</span> workspace 
          {activeSpace ? ` (${activeSpace.name})` : ''} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                   <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                   <XAxis 
                      dataKey="name" 
                      stroke="var(--muted-foreground)" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                   />
                   <YAxis 
                      stroke="var(--muted-foreground)" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `$${value}`} 
                   />
                   <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                      labelStyle={{ color: 'var(--foreground)' }}
                   />
                   <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--primary)" 
                      strokeWidth={2} 
                      dot={false}
                   />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity / Tasks Demo */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div className="flex items-center" key={i}>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Project {i} updated
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {i} hours ago by Admin
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    View
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
