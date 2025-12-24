import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  illustration?: ReactNode;
  variant?: 'classic' | 'illustration' | 'cover';
}

// 🎨 UI: Centered Glassmorphism Layout
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#161C24] relative overflow-hidden">
        {/* Background Gradients/Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-main/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-dark/20 blur-[120px]" />

        {/* Content Card */}
        <div className="z-10 w-full max-w-[480px] p-4">
            {children}
        </div>
    </div>
  );
}
