import * as React from 'react';
import { User } from 'lucide-react';


export interface OrgNode {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  children?: OrgNode[];
}

export interface OrganizationChartProps {
  /**
   * Root node
   */
  data: OrgNode;
  /**
   * Callback when node clicked
   */
  onNodeClick?: (node: OrgNode) => void;
}

const OrgChartNode: React.FC<{
  node: OrgNode;
  onNodeClick?: (node: OrgNode) => void;
}> = ({ node, onNodeClick }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <button
        onClick={() => onNodeClick?.(node)}
        className="flex flex-col items-center gap-2 p-4 bg-background-paper border border-divider rounded-lg hover:shadow-lg transition-all min-w-[160px]"
      >
        {node.avatar ? (
          <img
            src={node.avatar}
            alt={node.name}
            className="size-12 rounded-full object-cover"
          />
        ) : (
          <div className="size-12 rounded-full bg-primary-main/10 flex items-center justify-center">
            <User className="size-6 text-primary-main" />
          </div>
        )}
        <div className="text-center">
          <div className="font-medium text-sm">{node.name}</div>
          <div className="text-xs text-text-secondary">{node.title}</div>
        </div>
      </button>

      {/* Children */}
      {node.children && node.children.length > 0 && (
        <>
          {/* Connector Line */}
          <div className="w-px h-8 bg-divider" />

          {/* Children Container */}
          <div className="flex gap-8">
            {node.children.map((child) => (
              <div key={child.id} className="relative">
                {/* Horizontal Line */}
                {node.children && node.children.length > 1 && (
                  <div className="absolute top-0 left-1/2 w-full h-px bg-divider -translate-x-1/2" />
                )}
                <OrgChartNode node={child} onNodeClick={onNodeClick} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const OrganizationChart: React.FC<OrganizationChartProps> = ({
  data,
  onNodeClick,
}) => {
  return (
    <div className="overflow-auto p-8">
      <div className="inline-block min-w-full">
        <OrgChartNode node={data} onNodeClick={onNodeClick} />
      </div>
    </div>
  );
};

OrganizationChart.displayName = 'OrganizationChart';
