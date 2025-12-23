import * as React from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DndItem {
  id: string;
  content: React.ReactNode;
}

export interface DndProps {
  /**
   * Items
   */
  items: DndItem[];
  /**
   * Callback when items reorder
   */
  onReorder?: (items: DndItem[]) => void;
  /**
   * Render item
   */
  renderItem?: (item: DndItem, isDragging: boolean) => React.ReactNode;
}

export const Dnd: React.FC<DndProps> = ({ items: initialItems, onReorder, renderItem }) => {
  const [items, setItems] = React.useState(initialItems);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setItems(newItems);
    onReorder?.(newItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const isDragging = draggedIndex === index;
        const isOver = dragOverIndex === index;

        return (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={cn(
              'flex items-center gap-2 p-3 bg-background-paper border border-divider rounded-lg transition-all cursor-move',
              isDragging && 'opacity-50',
              isOver && 'border-primary-main bg-primary-main/5'
            )}
          >
            <GripVertical className="size-5 text-text-secondary shrink-0" />
            <div className="flex-1">{renderItem ? renderItem(item, isDragging) : item.content}</div>
          </div>
        );
      })}
    </div>
  );
};

Dnd.displayName = 'Dnd';
