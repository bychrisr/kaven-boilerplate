import { getTranslations } from 'next-intl/server';
import { TeamMembersTable } from '@/components/team/team-members-table';

export async function generateMetadata() {
    const t = await getTranslations('Users');
    return {
        title: `Team - Kaven Tenant`
    };
}

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Team Management</h3>
        <p className="text-muted-foreground">
          Manage your workspace members and their access levels.
        </p>
      </div>
      
      <TeamMembersTable />
    </div>
  );
}
