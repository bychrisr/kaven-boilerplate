'use client';

import { StatCard } from '../ui/stat-card';
import { Activity, Users, DollarSign, TrendingUp } from 'lucide-react';

export function StatCardDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
      <StatCard
        title="Total Users"
        value="12,345"
        icon={Users}
        trend={12.5}
        trendLabel="vs last month"
        tooltip="Total number of registered users in the platform"
      />
      
      <StatCard
        title="Active Sessions"
        value="456"
        icon={Activity}
        variant="outline"
        subtitle="Currently active users"
        tooltip="Users currently logged in across all devices"
      />

      <StatCard
        title="Revenue"
        value="$54,321"
        icon={DollarSign}
        trend={-2.4}
        trendLabel="vs last month"
        // Sem tooltip, mostra menu 3 pontos
      />

       <StatCard
        title="Conversion Rate"
        value="3.2%"
        icon={TrendingUp}
        variant="outline"
        spotlightColor="rgba(59, 130, 246, 0.2)"
        tooltip="Percentage of visitors who complete a goal"
      />
    </div>
  );
}
