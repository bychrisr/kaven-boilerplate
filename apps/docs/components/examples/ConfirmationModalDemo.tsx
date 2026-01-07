'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

export function ConfirmationModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          alert('Confirmed!');
          setIsOpen(false);
        }}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
}
