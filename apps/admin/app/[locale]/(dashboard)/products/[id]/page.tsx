'use client';

import { useProduct, useUpdateProduct } from '@/hooks/use-products';
import { ProductForm } from '@/components/products/product-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: product, isLoading } = useProduct(params.id);
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await updateProduct.mutateAsync({ id: params.id, ...data });
      toast.success('Produto atualizado com sucesso!');
      router.push('/products');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar produto';
      toast.error(message);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Carregando produto...</div></div>;
  if (!product) return <div className="flex flex-col items-center justify-center h-96 space-y-4"><p className="text-muted-foreground">Produto não encontrado</p><Link href="/products"><Button>Voltar para lista</Button></Link></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/products"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Produto</h1>
          <p className="text-muted-foreground mt-2">Atualize as informações do produto &quot;{product.name}&quot;</p>
        </div>
      </div>
      <ProductForm onSubmit={handleSubmit} defaultValues={product} isLoading={updateProduct.isPending} />
    </div>
  );
}
