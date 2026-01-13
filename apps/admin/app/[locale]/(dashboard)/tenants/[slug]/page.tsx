import { TenantDetailView } from '@/sections/tenant/view/tenant-details-view';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TenantDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <TenantDetailView idOrSlug={resolvedParams.slug} />;
}
