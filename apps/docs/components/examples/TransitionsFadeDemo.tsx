'use client';

import * as React from 'react';
import { Fade } from '@/components/ui/transitions';
import { Paper } from '@/components/ui/paper';
import { Switch } from '@/components/ui/switch';

export function TransitionsFadeDemo() {
  const [checked, setChecked] = React.useState(true);
  return (
    <div className="flex flex-col items-center gap-4 h-32">
      <div className="flex items-center gap-2">
         <Switch checked={checked} onChange={(e) => setChecked(e.target.checked)} /> Show
      </div>
      <Fade in={checked}>
        <Paper className="p-4 bg-primary-main text-white">Fade Transition</Paper>
      </Fade>
    </div>
  );
}
