'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';
import Link from 'next/link';

import { PoliciesList } from '@/components/policies/policies-list';
import { PolicyForm } from '@/components/policies/policy-form';
import { usePolicies, usePolicy } from '@/hooks/use-policies';
import { Skeleton } from '@/components/ui/skeleton';

export function PoliciesView() {
  const t = useTranslations('Policies');
  const tCommon = useTranslations('Common');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);

  const { data, isLoading } = usePolicies();
  const { data: editingPolicyData, isLoading: isLoadingPolicy } = usePolicy(editingPolicyId || '');

  const handleCreate = () => {
    setEditingPolicyId(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (policyId: string) => {
    setEditingPolicyId(policyId);
    setIsSheetOpen(true);
  };

  const handleSuccess = () => {
    setIsSheetOpen(false);
    setEditingPolicyId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('title')}</h1>
          <div className="mt-2">
            <Breadcrumbs>
              <BreadcrumbItem>
                <Link href="/dashboard" className="transition-colors hover:text-foreground">
                  {tCommon('dashboard')}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem current>{t('title')}</BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('list.add')}
        </Button>
      </div>

      <Card className="!p-0 !gap-0 block overflow-hidden border-none shadow-md bg-card dark:bg-[#212B36]">
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <PoliciesList 
            policies={data?.policies || []} 
            onEdit={handleEdit} 
          />
        )}
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>
              {editingPolicyId ? t('form.titleEdit') : t('form.titleCreate')}
            </SheetTitle>
            <SheetDescription>
              {editingPolicyId ? t('form.descriptionEdit') : t('form.descriptionCreate')}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            {editingPolicyId && isLoadingPolicy ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <PolicyForm 
                initialData={editingPolicyId ? editingPolicyData?.policy : undefined} 
                onSuccess={handleSuccess} 
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
