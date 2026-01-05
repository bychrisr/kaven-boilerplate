'use client';

import { useCreatePlan } from '@/hooks/use-plans';
import { PlanForm } from '@/components/plans/plan-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewPlanPage() {
  const router = useRouter();
  const createPlan = useCreatePlan();

  const handleSubmit = async (data: any) => {
    try {
      await createPlan.mutateAsync(data);
      toast.success('Plano criado com sucesso!');
      router.push('/plans');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar plano');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/plans">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Plano</h1>
          <p className="text-muted-foreground mt-2">
            Crie um novo plano de assinatura para o sistema
          </p>
        </div>
      </div>

      {/* Form */}
      <PlanForm onSubmit={handleSubmit} isLoading={createPlan.isPending} />
    </div>
  );
}
