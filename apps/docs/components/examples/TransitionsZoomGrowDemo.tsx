'use client';

import * as React from 'react';
import { Zoom, Grow } from '@/components/ui/transitions';
import { Paper } from '@/components/ui/paper';
import { Switch } from '@/components/ui/switch';

export function TransitionsZoomGrowDemo() {
  const [checked, setChecked] = React.useState(true);
  return (
    <div className="flex flex-col items-center gap-4 w-full h-32">
        <div className="flex items-center gap-2">
           <Switch checked={checked} onChange={(e) => setChecked(e.target.checked)} /> Show
       </div>
       <div className="flex gap-4">
           <Zoom in={checked}>
               <Paper className="p-4 w-24 text-center">Zoom</Paper>
           </Zoom>
            <Grow in={checked}>
               <Paper className="p-4 w-24 text-center">Grow</Paper>
           </Grow>
       </div>
   </div>
  );
}
