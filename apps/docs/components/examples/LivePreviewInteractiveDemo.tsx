'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

export function LivePreviewInteractiveDemo() {
  const [count, setCount] = React.useState(0);
  return (
    <div className="flex justify-center">
      <Button onClick={() => setCount(c => c + 1)}>
        Clicks: {count}
      </Button>
    </div>
  );
}
