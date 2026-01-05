'use client';

import { usePlan, useUpdatePlan } from '@/hooks/use-plans';
import { PlanForm } from '@/components/plans/plan-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EditPlanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: plan, isLoading } = usePlan(params.id);
  const updatePlan = useUpdatePlan();

  const handleSubmit = async (data: any) => {
    try {
      await updatePlan.mutateAsync({ id: params.id, ...data });
      toast.success('Plano atualizado com sucesso!');
      router.push('/plans');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar plano');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Carregando plano...</div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-muted-foreground">Plano não encontrado</p>
        <Link href="/plans">
          <Button>Voltar para lista</Button>
        </Link>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Editar Plano</h1>
          <p className="text-muted-foreground mt-2">
            Atualize as informações do plano "{plan.name}"
          </p>
        </div>
      </div>

      {/* Form */}
      <PlanForm
        onSubmit={handleSubmit}
        defaultValues={plan}
        isLoading={updatePlan.isPending}
      />
    </div>
  );
}
