'use client';

import { useCreateFeature } from '@/hooks/use-features';
import { FeatureForm } from '@/components/features/feature-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewFeaturePage() {
  const router = useRouter();
  const createFeature = useCreateFeature();

  const handleSubmit = async (data: any) => {
    try {
      await createFeature.mutateAsync(data);
      toast.success('Feature criada com sucesso!');
      router.push('/admin/features');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar feature');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/features"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Feature</h1>
          <p className="text-muted-foreground mt-2">Crie uma nova funcionalidade do sistema</p>
        </div>
      </div>
      <FeatureForm onSubmit={handleSubmit} isLoading={createFeature.isPending} />
    </div>
  );
}
