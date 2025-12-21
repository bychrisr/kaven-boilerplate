'use client';

import { useCurrentUser, useUpdateUser } from '@/hooks/use-users';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, User } from 'lucide-react';
import { useEffect } from 'react';

const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  // Add other fields if API supports them (e.g. bio, phone in metadata)
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSettingsPage() {
  const { data: user, isLoading } = useCurrentUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser(user?.id || '');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-main" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meu Perfil</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Placeholder - Future Implementation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 bg-primary-light/10 border border-primary-main/20 rounded-full flex items-center justify-center text-primary-main text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || <User />}
              </div>
              <div>
                <button
                  type="button"
                  disabled
                  className="text-sm text-gray-400 font-medium cursor-not-allowed"
                >
                  Alterar Foto (Em breve)
                </button>
                <p className="text-xs text-gray-400 mt-1">Recurso de upload em desenvolvimento.</p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                 errors.name ? 'border-error-main focus:border-error-main focus:ring-error-light/50' : 'border-gray-300 focus:ring-primary-main focus:border-primary-main'
              }`}
            />
             {errors.name && (
              <p className="mt-1 text-sm text-error-main">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                 errors.email ? 'border-error-main focus:border-error-main focus:ring-error-light/50' : 'border-gray-300 focus:ring-primary-main focus:border-primary-main'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error-main">{errors.email.message}</p>
            )}
          </div>

          {/* Role (Read Only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
            <input
              type="text"
              value={user?.role || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
            />
          </div>

          {/* Save Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-2 bg-primary-main text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
