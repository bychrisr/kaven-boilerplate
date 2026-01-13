'use client';

import { Suspense } from 'react';
import SignupForm from './signup-form';

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
