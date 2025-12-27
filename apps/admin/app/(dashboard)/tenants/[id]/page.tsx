import { TenantDetailView } from '@/sections/tenant/view/tenant-details-view';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TenantDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <TenantDetailView id={resolvedParams.id} />;
}
