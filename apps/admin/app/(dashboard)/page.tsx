// 🎨 UI: Dashboard Page (Dark Glassmorphism)
'use client';

import { useUsers } from '@/hooks/use-users';
import { Users, DollarSign, FileText, ShoppingCart, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER';
  createdAt: string;
}

const getRoleBadgeClasses = (role: string) => {
  if (role === 'SUPER_ADMIN') return 'bg-error-main/10 text-error-main border border-error-main/20';
  if (role === 'TENANT_ADMIN') return 'bg-warning-main/10 text-warning-main border border-warning-main/20';
  return 'bg-info-main/10 text-info-main border border-info-main/20';
};

export default function DashboardPage() {
  const { data: usersData } = useUsers({ page: 1, limit: 5 });

  // Mock data para métricas
  const metrics = {
    totalUsers: usersData?.pagination.total || 18765,
    revenue: 4876,
    invoices: 678,
    orders: 45,
  };

  const chartData = [
    { name: 'Jan', revenue: 45, users: 18 },
    { name: 'Feb', revenue: 52, users: 25 },
    { name: 'Mar', revenue: 38, users: 20 },
    { name: 'Apr', revenue: 65, users: 32 },
    { name: 'May', revenue: 48, users: 28 },
    { name: 'Jun', revenue: 70, users: 45 },
    { name: 'Jul', revenue: 65, users: 50 },
    { name: 'Aug', revenue: 78, users: 58 },
    { name: 'Sep', revenue: 82, users: 65 },
    { name: 'Oct', revenue: 90, users: 75 },
    { name: 'Nov', revenue: 95, users: 85 },
    { name: 'Dec', revenue: 100, users: 95 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#161C24] border border-gray-700 p-3 rounded-lg shadow-xl">
          <p className="text-gray-400 text-xs mb-1">{label}</p>
          <p className="text-white font-bold text-sm">
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-white">Hi, Welcome back 👋</h1>
            <p className="mt-1 text-sm text-gray-400">Here&apos;s what&apos;s happening with your store today.</p>
         </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Active Users */}
        <div className="relative overflow-hidden rounded-2xl bg-[#212B36] p-6 shadow-2xl border border-gray-700/50">
            <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-primary-main/10 rounded-full">
                    <Users className="h-6 w-6 text-primary-main" />
                 </div>
                 <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Active Users</span>
            </div>
            <div className="flex items-end justify-between">
                <div>
                     <h3 className="text-3xl font-bold text-white mb-2">{metrics.totalUsers.toLocaleString()}</h3>
                     <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center text-success-main font-semibold bg-success-main/10 px-1.5 py-0.5 rounded">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            +2.6%
                        </span>
                        <span className="text-gray-500">last 7 days</span>
                     </div>
                </div>
                 {/* Mini Chart Area (Simulated) */}
                 <div className="h-12 w-24">
                     <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={[{v:20},{v:40},{v:30},{v:70},{v:50}]}>
                             <Bar dataKey="v" fill="#00A76F" radius={[2,2,0,0]} />
                         </BarChart>
                     </ResponsiveContainer>
                 </div>
            </div>
        </div>

        {/* Total Installed */}
         <div className="relative overflow-hidden rounded-2xl bg-[#212B36] p-6 shadow-2xl border border-gray-700/50">
            <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-info-main/10 rounded-full">
                    <DollarSign className="h-6 w-6 text-info-main" />
                 </div>
                 <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Installed</span>
            </div>
             <div className="flex items-end justify-between">
                <div>
                     <h3 className="text-3xl font-bold text-white mb-2">{metrics.revenue.toLocaleString()}</h3>
                     <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center text-success-main font-semibold bg-success-main/10 px-1.5 py-0.5 rounded">
                             <ArrowUp className="h-3 w-3 mr-1" />
                            +0.2%
                        </span>
                        <span className="text-gray-500">last 7 days</span>
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

        {/* Total Downloads */}
         <div className="relative overflow-hidden rounded-2xl bg-[#212B36] p-6 shadow-2xl border border-gray-700/50">
            <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-warning-main/10 rounded-full">
                    <FileText className="h-6 w-6 text-warning-main" />
                 </div>
                 <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Downloads</span>
            </div>
             <div className="flex items-end justify-between">
                <div>
                     <h3 className="text-3xl font-bold text-white mb-2">{metrics.invoices}</h3>
                     <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center text-error-main font-semibold bg-error-main/10 px-1.5 py-0.5 rounded">
                             <ArrowDown className="h-3 w-3 mr-1" />
                            -0.1%
                        </span>
                        <span className="text-gray-500">last 7 days</span>
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
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-2xl bg-[#212B36] p-6 shadow-xl border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Area Installed</h3>
                <p className="text-sm text-gray-500">(+43%) than last year</p>
              </div>
          </div>
          
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#919EAB33" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#919EAB'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#919EAB'}} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 }} />
                <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#00A76F" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#00A76F' }}
                />
                 <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#FFAB00" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#FFAB00' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Download (Pie equivalent - Simplified to Bar for now or reusing existing layout) */}
         <div className="rounded-2xl bg-[#212B36] p-6 shadow-xl border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Current Download</h3>
                <p className="text-sm text-gray-500">Downloaded by operating system</p>
              </div>
          </div>

          <div className="h-80 w-full flex items-center justify-center relative">
               {/* Simulating a Donut Chart with CSS or SVG would be complex here without a library like Recharts Pie. 
                   Using BarChart as placeholder for visual consistency with the request for now, or reverting to simple stats.
                   Actually, let's try a simple Recharts Pie if available. Yes it is imported generally, but let's stick to the Bar provided in prompt or close to it.
                   Reusing BarChart for "Downloads" per month.
               */}
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#919EAB33" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#919EAB'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#919EAB'}} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                    <Bar dataKey="revenue" fill="#00B8D9" radius={[4, 4, 0, 0]} barSize={12} />
                    <Bar dataKey="users" fill="#FF5630" radius={[4, 4, 0, 0]} barSize={12} />
                 </BarChart>
               </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-2xl bg-[#212B36] shadow-xl border border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-700/50">
             <h3 className="text-lg font-bold text-white">New Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700/50">
            <thead className="bg-[#1C252E]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                   Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50 bg-[#212B36]">
              {usersData?.users.map((user: User) => (
                <tr key={user.id} className="hover:bg-[#2A3441] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-main to-primary-dark flex items-center justify-center text-white font-bold text-sm">
                           {user.name.charAt(0)}
                       </div>
                       <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${getRoleBadgeClasses(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                   <td className="px-6 py-4 text-right">
                       <button className="text-gray-400 hover:text-white transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                       </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
