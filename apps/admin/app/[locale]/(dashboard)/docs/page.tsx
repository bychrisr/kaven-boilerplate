import { Metadata } from 'next';
import DocsView from '@/sections/docs/view/docs-view';

export const metadata: Metadata = {
  title: 'Design System Documentation | Kaven Admin',
  description: 'Interactive documentation and showcase of Minimals Design System components',
};

export default function DocsPage() {
  return <DocsView />;
}
