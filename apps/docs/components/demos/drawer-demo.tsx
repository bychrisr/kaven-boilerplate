import * as React from 'react';
import { Button } from '../ui/button';
import { Drawer, DrawerHeader, DrawerContent } from '../ui/drawer';

export function DrawerDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} anchor="right">
        <DrawerHeader onClose={() => setOpen(false)}>
          Move Goal
        </DrawerHeader>
        <DrawerContent>
          <div className="p-4 pb-0">
             <div className="flex items-center justify-center space-x-2">
              <span className="text-4xl font-bold tracking-tighter">350</span>
              <span className="text-sm uppercase text-gray-500">
                Calories/day
              </span>
            </div>
            <p className="mt-4 text-gray-600">Set your daily activity goal.</p>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => setOpen(false)}>Submit</Button>
             <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
