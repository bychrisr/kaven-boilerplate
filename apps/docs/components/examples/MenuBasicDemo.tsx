'use client';

import * as React from 'react';
import { Menu, MenuItem } from '@/components/ui/menu';
import { Button } from '@/components/ui/button';

export function MenuBasicDemo() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex w-full gap-4 flex-wrap justify-center items-center h-48">
      <Button onClick={handleClick}>Abrir Menu</Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Perfil</MenuItem>
        <MenuItem onClick={handleClose}>Minha Conta</MenuItem>
        <MenuItem onClick={handleClose}>Sair</MenuItem>
      </Menu>
    </div>
  );
}
