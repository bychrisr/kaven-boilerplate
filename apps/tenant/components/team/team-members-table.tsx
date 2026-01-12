'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Search, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InviteUserDialog } from '@/components/users/invite-dialog';

// Shared type or imported from API types
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  avatarUrl?: string;
  spaces?: string[]; // Space codes
}

const MOCK_MEMBERS: TeamMember[] = [
  { id: '1', name: 'The Architect', email: 'admin@kaven.dev', role: 'SUPER_ADMIN', status: 'ACTIVE', spaces: ['ADMIN', 'FINANCE', 'SUPPORT'] },
  { id: '2', name: 'Finance Lead', email: 'finance@admin.com', role: 'TENANT_ADMIN', status: 'ACTIVE', spaces: ['FINANCE'] },
  { id: '3', name: 'Support Agent', email: 'support@admin.com', role: 'USER', status: 'ACTIVE', spaces: ['SUPPORT'] },
];

export function TeamMembersTable() {
  // const t = useTranslations('Users');
  const [search, setSearch] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Filter logic
  const filtered = MOCK_MEMBERS.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-64">
           <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input 
             placeholder="Search team..." 
             className="pl-8"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        <Button onClick={() => setIsInviteOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Spaces</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                     <span className="font-medium">{member.name}</span>
                     <span className="text-xs text-muted-foreground">{member.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{member.role}</Badge>
                </TableCell>
                <TableCell>
                   <Badge className={member.status === 'ACTIVE' ? 'bg-green-500/15 text-green-700 hover:bg-green-500/25' : 'bg-yellow-500/15 text-yellow-700'}>
                     {member.status}
                   </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {member.spaces?.map(space => (
                       <Badge key={space} variant="secondary" className="text-[10px]">
                         {space}
                       </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <InviteUserDialog 
        open={isInviteOpen} 
        onClose={() => setIsInviteOpen(false)} 
      />
    </div>
  );
}
