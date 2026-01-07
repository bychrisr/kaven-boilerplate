'use client';

import * as React from 'react';
import { Collapse } from '@/components/ui/transitions';
import { Paper } from '@/components/ui/paper';
import { Button } from '@/components/ui/button';

export function TransitionsCollapseDemo() {
  const [checked, setChecked] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <Button onClick={() => setChecked(!checked)} fullWidth>
         {checked ? 'Hide Details' : 'Show Details'}
      </Button>
      <Collapse in={checked}>
        <Paper className="p-4 mt-2 bg-gray-50">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Paper>
      </Collapse>
    </div>
  );
}
