'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { TasksTable } from '@/components/demo/tasks/tasks-table';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';
  color?: string;
  tenantId: string;
  spaceId?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  space?: {
    id: string;
    name: string;
    color: string;
  } | null;
  tasks?: any[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const projectId = params.id as string;

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await api.get(`/api/app/projects/${projectId}`);
      return res.data as Project;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/api/app/projects/${projectId}`);
    },
    onSuccess: () => {
      toast.success('Project deleted successfully');
      router.push('/projects');
    },
    onError: () => {
      toast.error('Failed to delete project');
    },
  });

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this project? This will also delete all tasks.')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
        <div className="h-64 bg-muted/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
        <p className="text-lg font-medium">Project not found</p>
        <Button onClick={() => router.push('/projects')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">{project.name}</h3>
            <p className="text-muted-foreground text-sm">
              {project.description || 'No description provided'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Project Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>Details about this project</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
            <span className="text-sm text-muted-foreground">Status</span>
          </div>
          
          {project.space && (
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: project.space.color }}
              />
              <span className="text-sm">{project.space.name}</span>
              <span className="text-sm text-muted-foreground">Space</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{project.createdBy.name}</span>
            <span className="text-muted-foreground">Created by</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(project.createdAt), 'PPP')}</span>
            <span className="text-muted-foreground">Created</span>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Manage tasks for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <TasksTable projectId={projectId} />
        </CardContent>
      </Card>
    </div>
  );
}
