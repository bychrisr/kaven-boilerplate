'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRole, useUpdateRole, Role } from '@/hooks/use-roles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CapabilitySelector } from './capability-selector';
import { Loader2 } from 'lucide-react';
import { useSpaces } from '@/hooks/use-spaces';

const roleSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(50),
  description: z.string().optional(),
  capabilities: z.array(z.string()), // Remove default to avoid type issues with infer
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormProps {
  initialData?: Role;
  onSuccess?: () => void;
}

export function RoleForm({ initialData, onSuccess }: RoleFormProps) {
  const { currentSpace } = useSpaces();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const isEditing = !!initialData;
  const isLoading = createRole.isPending || updateRole.isPending;

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      capabilities: initialData?.capabilities?.map((rc) => rc.capability.id) || [],
    },
  });

  const onSubmit = async (data: RoleFormValues) => {
    try {
      if (isEditing && initialData) {
        await updateRole.mutateAsync({
          id: initialData.id,
          ...data,
        });
      } else {
        if (!currentSpace) return;
        await createRole.mutateAsync({
          spaceId: currentSpace.id,
          ...data,
        });
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Role</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Editor de Conteúdo" {...field} disabled={isLoading || !!initialData?.isSystem} />
                </FormControl>
                <FormDescription>
                  O nome identificável da role.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descreva as responsabilidades desta role..." {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capabilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Permissões (Capabilities)</FormLabel>
                <FormDescription className="mb-4">
                  Selecione as ações que esta role pode executar.
                </FormDescription>
                <FormControl>
                  <CapabilitySelector 
                    selectedCapabilities={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Salvar Alterações' : 'Criar Role'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
