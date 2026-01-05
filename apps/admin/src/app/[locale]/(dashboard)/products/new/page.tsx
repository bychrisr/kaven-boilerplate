'use client';

import { useCreateProduct } from '@/hooks/use-products';
import { ProductForm } from '@/components/products/product-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  const handleSubmit = async (data: any) => {
    try {
      await createProduct.mutateAsync(data);
      toast.success('Produto criado com sucesso!');
      router.push('/products');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar produto');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/products"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Produto</h1>
          <p className="text-muted-foreground mt-2">Crie um novo produto one-time ou add-on</p>
        </div>
      </div>
      <ProductForm onSubmit={handleSubmit} isLoading={createProduct.isPending} />
    </div>
  );
}
