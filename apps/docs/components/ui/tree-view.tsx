'use client';

import * as React from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeViewProps {
  /**
   * Tree data
   */
  data: TreeNode[];
  /**
   * Selected node IDs
   */
  selected?: string[];
  /**
   * Callback when selection changes
   */
  onSelect?: (nodeIds: string[]) => void;
  /**
   * Expanded node IDs
   */
  expanded?: string[];
  /**
   * Callback when expansion changes
   */
  onToggle?: (nodeIds: string[]) => void;
  /**
   * Multi-select
   */
  multiSelect?: boolean;
  /**
   * Default expanded
   */
  defaultExpanded?: string[];
  /**
   * Default selected
   */
  defaultSelected?: string[];
  /**
   * Default icon for folders
   */
  defaultFolderIcon?: React.ReactNode;
  /**
   * Default icon for files
   */
  defaultFileIcon?: React.ReactNode;
}

const TreeViewContext = React.createContext<{
  selected: string[];
  expanded: string[];
  onSelect: (nodeId: string) => void;
  onToggle: (nodeId: string) => void;
  multiSelect: boolean;
  defaultFolderIcon?: React.ReactNode;
  defaultFileIcon?: React.ReactNode;
} | null>(null);

export const TreeView: React.FC<TreeViewProps> = ({
  data,
  selected: controlledSelected,
  onSelect,
  expanded: controlledExpanded,
  onToggle,
  multiSelect = false,
  defaultExpanded = [],
  defaultSelected = [],
  defaultFolderIcon = <Folder className="size-4" />,
  defaultFileIcon = <File className="size-4" />,
}) => {
  const [internalSelected, setInternalSelected] = React.useState<string[]>(defaultSelected);
  const [internalExpanded, setInternalExpanded] = React.useState<string[]>(defaultExpanded);

  const selected = controlledSelected ?? internalSelected;
  const expanded = controlledExpanded ?? internalExpanded;

  const handleSelect = (nodeId: string) => {
    let newSelected: string[];

    if (multiSelect) {
      newSelected = selected.includes(nodeId)
        ? selected.filter((id) => id !== nodeId)
        : [...selected, nodeId];
    } else {
      newSelected = [nodeId];
    }

    setInternalSelected(newSelected);
    onSelect?.(newSelected);
  };

  const handleToggle = (nodeId: string) => {
    const newExpanded = expanded.includes(nodeId)
      ? expanded.filter((id) => id !== nodeId)
      : [...expanded, nodeId];

    setInternalExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  return (
    <TreeViewContext.Provider
      value={{
        selected,
        expanded,
        onSelect: handleSelect,
        onToggle: handleToggle,
        multiSelect,
        defaultFolderIcon,
        defaultFileIcon,
      }}
    >
      <div className="py-2">
        {data.map((node) => (
          <TreeNode key={node.id} node={node} level={0} />
        ))}
      </div>
    </TreeViewContext.Provider>
  );
};

TreeView.displayName = 'TreeView';

interface TreeNodeProps {
  node: TreeNode;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level }) => {
  const context = React.useContext(TreeViewContext);
  if (!context) {
    throw new Error('TreeNode must be used within TreeView');
  }

  const { selected, expanded, onSelect, onToggle, defaultFolderIcon, defaultFileIcon } = context;

  const isExpanded = expanded.includes(node.id);
  const isSelected = selected.includes(node.id);
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    if (!node.disabled) {
      onSelect(node.id);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggle(node.id);
    }
  };

  const icon =
    node.icon ||
    (hasChildren ? (
      isExpanded ? (
        <FolderOpen className="size-4" />
      ) : (
        defaultFolderIcon
      )
    ) : (
      defaultFileIcon
    ));

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1.5 cursor-pointer transition-colors rounded',
          'hover:bg-action-hover',
          isSelected && 'bg-action-selected',
          node.disabled && 'opacity-50 cursor-not-allowed'
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={handleClick}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={handleToggle}
            className="p-0.5 hover:bg-action-hover rounded"
          >
            {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <span className="shrink-0">{icon}</span>
        <span className="text-sm truncate">{node.label}</span>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

TreeNode.displayName = 'TreeNode';
export { TreeNode as TreeItem };
