import { AuthLayout } from '@/components/layout/auth-layout';

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
