'use client';

import * as React from 'react';
import { Menu, MenuItem } from '@/components/ui/menu';
import { Button } from '@/components/ui/button';

export function MenuSelectionDemo() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const open = Boolean(anchorEl);

  const handleClickListItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = ['Leitura', 'Escrita', 'Admin'];

  return (
    <div className="flex w-full gap-4 flex-wrap justify-center items-center h-64">
      <Button variant="outlined" onClick={handleClickListItem}>
        Opções {selectedIndex !== null ? `(${options[selectedIndex]})` : ''}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem 
            selected={selectedIndex === 0}
            onClick={(event) => handleMenuItemClick(event, 0)}
        >
            Leitura
        </MenuItem>
        <MenuItem 
            selected={selectedIndex === 1}
            onClick={(event) => handleMenuItemClick(event, 1)}
        >
            Escrita
        </MenuItem>
        <MenuItem divider ><></></MenuItem>
        <MenuItem 
            selected={selectedIndex === 2}
            onClick={(event) => handleMenuItemClick(event, 2)}
        >
            Admin
        </MenuItem>
      </Menu>
    </div>
  );
}
