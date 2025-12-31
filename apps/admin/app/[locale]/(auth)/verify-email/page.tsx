'use client';

import { Suspense } from 'react';
import VerifyEmailContent from './verify-email-content';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="space-y-6 text-center">Verifying...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
