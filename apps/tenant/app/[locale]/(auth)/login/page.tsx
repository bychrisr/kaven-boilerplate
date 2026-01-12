'use client';

import { Suspense } from 'react';
import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="space-y-6">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
