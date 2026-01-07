'use client';

import { useState } from 'react';
import { ClickAwayListener } from '@/components/ui/click-away-listener';
import { Button } from '@/components/ui/button';

export function ClickAwayListenerDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div className="relative inline-block">
        <Button onClick={() => setIsOpen(!isOpen)} variant="outlined">
          {isOpen ? 'Click outside to close' : 'Click me'}
        </Button>
        
        {isOpen && (
          <div className="absolute left-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 z-10 p-4">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              This box will close if you click anywhere outside of it.
            </p>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
}
