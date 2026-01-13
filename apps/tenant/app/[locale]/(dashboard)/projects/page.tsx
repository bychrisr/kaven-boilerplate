'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTenant } from '@/lib/hooks/use-tenant';
import { useSpace } from '@/lib/hooks/use-space';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Folder, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';
  tenantId: string;
  createdAt: string;
  createdBy: {
    name: string;
  };
  updatedAt: string;
  _count?: {
      tasks: number;
  }
}

export default function ProjectsPage() {
  const { tenant } = useTenant();
  const { activeSpaceId } = useSpace(); // Removed activeSpace unused var
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', tenant?.id, activeSpaceId],
    queryFn: async () => {
      const params: any = {};
      if (activeSpaceId) params.spaceId = activeSpaceId;
      
      const res = await api.get('/api/app/projects', { params });
      return res.data;
    },
    enabled: !!tenant?.id,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      // Include current spaceId in creation payload
      const payload: any = { ...data };
      if (activeSpaceId) payload.spaceId = activeSpaceId;
      
      const res = await api.post('/api/app/projects', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsOpen(false);
      setNewProjectName('');
      setNewProjectDesc('');
      toast.success('Project created successfully');
    },
    onError: () => {
      toast.error('Failed to create project');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ name: newProjectName, description: newProjectDesc });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Projects</h3>
          <p className="text-muted-foreground">
            Manage your tenant's ongoing initiatives.
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Add a new project to your workspace.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={newProjectName} 
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  value={newProjectDesc} 
                  onChange={(e) => setNewProjectDesc(e.target.value)} 
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Project'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           {[1,2,3].map(i => <div key={i} className="h-40 rounded-xl bg-muted/50 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects?.data?.map((project: Project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Folder className="h-5 w-5" />
                  </div>
                  <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {project.description || 'No description provided.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                   <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(project.updatedAt), 'PP')}</span>
                   </div>
                   {/* If backend returns task count */}
                   {project._count?.tasks !== undefined && (
                      <div className="text-xs bg-secondary px-2 py-0.5 rounded">
                        {project._count.tasks} Tasks
                      </div>
                   )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 text-xs text-muted-foreground justify-between">
                <span>By {project.createdBy?.name || 'Unknown'}</span>
                <Link href={`/projects/${project.id}`}>
                  <Button variant="ghost" size="sm" className="h-6">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
          
          {projects?.data?.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                <Folder className="h-10 w-10 mb-4 opacity-20" />
                <p>No projects found. Create one to get started.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
