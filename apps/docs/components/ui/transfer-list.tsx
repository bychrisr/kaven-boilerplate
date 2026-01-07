'use client';

import * as React from 'react';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TransferListItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface TransferListProps {
  /**
   * Available items (left list)
   */
  items: TransferListItem[];
  /**
   * Selected items (right list)
   */
  selected?: string[];
  /**
   * Callback when selection changes
   */
  onChange?: (selected: string[]) => void;
  /**
   * Left list title
   */
  leftTitle?: string;
  /**
   * Right list title
   */
  rightTitle?: string;
  /**
   * Enable search
   */
  searchable?: boolean;
}

export const TransferList: React.FC<TransferListProps> = ({
  items,
  selected: controlledSelected = [],
  onChange,
  leftTitle = 'Disponíveis',
  rightTitle = 'Selecionados',
  searchable = true,
}) => {
  const [selected, setSelected] = React.useState<string[]>(controlledSelected);
  const [leftChecked, setLeftChecked] = React.useState<string[]>([]);
  const [rightChecked, setRightChecked] = React.useState<string[]>([]);
  const [leftSearch, setLeftSearch] = React.useState('');
  const [rightSearch, setRightSearch] = React.useState('');

  const currentSelected = controlledSelected.length > 0 ? controlledSelected : selected;

  const leftItems = items.filter((item) => !currentSelected.includes(item.id));
  const rightItems = items.filter((item) => currentSelected.includes(item.id));

  const filteredLeftItems = leftItems.filter((item) =>
    item.label.toLowerCase().includes(leftSearch.toLowerCase())
  );

  const filteredRightItems = rightItems.filter((item) =>
    item.label.toLowerCase().includes(rightSearch.toLowerCase())
  );

  const handleToggle = (id: string, side: 'left' | 'right') => {
    const checked = side === 'left' ? leftChecked : rightChecked;
    const setChecked = side === 'left' ? setLeftChecked : setRightChecked;

    const newChecked = checked.includes(id)
      ? checked.filter((itemId) => itemId !== id)
      : [...checked, id];

    setChecked(newChecked);
  };

  const handleMoveRight = () => {
    const newSelected = [...currentSelected, ...leftChecked];
    setSelected(newSelected);
    onChange?.(newSelected);
    setLeftChecked([]);
  };

  const handleMoveLeft = () => {
    const newSelected = currentSelected.filter((id) => !rightChecked.includes(id));
    setSelected(newSelected);
    onChange?.(newSelected);
    setRightChecked([]);
  };

  const handleSelectAll = (side: 'left' | 'right') => {
    const itemsToSelect = side === 'left' ? filteredLeftItems : filteredRightItems;
    const setChecked = side === 'left' ? setLeftChecked : setRightChecked;
    setChecked(itemsToSelect.filter((item) => !item.disabled).map((item) => item.id));
  };

  const handleDeselectAll = (side: 'left' | 'right') => {
    const setChecked = side === 'left' ? setLeftChecked : setRightChecked;
    setChecked([]);
  };

  const renderList = (
    listItems: TransferListItem[],
    checked: string[],
    side: 'left' | 'right',
    searchValue: string,
    onSearchChange: (value: string) => void
  ) => (
    <div className="flex flex-col border border-divider rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-background-default border-b border-divider">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm">
            {side === 'left' ? leftTitle : rightTitle} ({listItems.length})
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSelectAll(side)}
              className="text-xs text-primary-main hover:underline"
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => handleDeselectAll(side)}
              className="text-xs text-primary-main hover:underline"
            >
              Nenhum
            </button>
          </div>
        </div>
        {searchable && (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-text-secondary" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-divider rounded focus:outline-none focus:ring-2 focus:ring-primary-main/20"
            />
          </div>
        )}
      </div>
      <div className="h-64 overflow-y-auto">
        {listItems.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-text-secondary">
            Nenhum item
          </div>
        ) : (
          listItems.map((item) => (
            <label
              key={item.id}
              className={cn(
                'flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-action-hover transition-colors',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <input
                type="checkbox"
                checked={checked.includes(item.id)}
                onChange={() => !item.disabled && handleToggle(item.id, side)}
                disabled={item.disabled}
                className="size-4 rounded border-gray-300 text-primary-main focus:ring-primary-main"
              />
              <span className="text-sm">{item.label}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-4">
      {/* Left list */}
      <div className="flex-1">
        {renderList(filteredLeftItems, leftChecked, 'left', leftSearch, setLeftSearch)}
      </div>

      {/* Transfer buttons */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleMoveRight}
          disabled={leftChecked.length === 0}
          className={cn(
            'p-2 rounded border-2 border-gray-300 transition-colors',
            'hover:bg-action-hover disabled:opacity-30 disabled:cursor-not-allowed'
          )}
          title="Mover para direita"
        >
          <ChevronRight className="size-5" />
        </button>
        <button
          type="button"
          onClick={handleMoveLeft}
          disabled={rightChecked.length === 0}
          className={cn(
            'p-2 rounded border-2 border-gray-300 transition-colors',
            'hover:bg-action-hover disabled:opacity-30 disabled:cursor-not-allowed'
          )}
          title="Mover para esquerda"
        >
          <ChevronLeft className="size-5" />
        </button>
      </div>

      {/* Right list */}
      <div className="flex-1">
        {renderList(filteredRightItems, rightChecked, 'right', rightSearch, setRightSearch)}
      </div>
    </div>
  );
};

TransferList.displayName = 'TransferList';
