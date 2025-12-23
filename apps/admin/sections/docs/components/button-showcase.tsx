'use client';

import { Button } from '@/components/ui/button';
import { Download, Trash2, Plus } from 'lucide-react';

export default function ButtonShowcase() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Button Component</h2>
        <p className="text-gray-600 mb-6">
          Buttons allow users to take actions with a single tap. They communicate calls to action.
        </p>
      </div>

      {/* Variants */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="contained" color="primary">
            Contained
          </Button>
          <Button variant="outlined" color="primary">
            Outlined
          </Button>
          <Button variant="text" color="primary">
            Text
          </Button>
          <Button variant="soft" color="primary">
            Soft
          </Button>
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Colors</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="contained" color="primary">
            Primary
          </Button>
          <Button variant="contained" color="secondary">
            Secondary
          </Button>
          <Button variant="contained" color="success">
            Success
          </Button>
          <Button variant="contained" color="warning">
            Warning
          </Button>
          <Button variant="contained" color="error">
            Error
          </Button>
          <Button variant="contained" color="info">
            Info
          </Button>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="contained" color="primary" size="sm">
            Small
          </Button>
          <Button variant="contained" color="primary" size="md">
            Medium
          </Button>
          <Button variant="contained" color="primary" size="lg">
            Large
          </Button>
        </div>
      </div>

      {/* With Icons */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">With Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="contained" color="primary" startIcon={<Plus className="h-4 w-4" />}>
            Create New
          </Button>
          <Button variant="outlined" color="error" startIcon={<Trash2 className="h-4 w-4" />}>
            Delete
          </Button>
          <Button variant="soft" color="info" startIcon={<Download className="h-4 w-4" />}>
            Download
          </Button>
        </div>
      </div>

      {/* States */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">States</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="contained" color="primary">
            Default
          </Button>
          <Button variant="contained" color="primary" loading>
            Loading
          </Button>
          <Button variant="contained" color="primary" disabled>
            Disabled
          </Button>
        </div>
      </div>

      {/* Full Width */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Full Width</h3>
        <Button variant="contained" color="primary" fullWidth>
          Full Width Button
        </Button>
      </div>

      {/* Code Example */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Example</h3>
        <pre className="text-sm text-gray-800 overflow-x-auto">
          <code>{`import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

<Button variant="contained" color="primary" startIcon={<Plus />}>
  Create New
</Button>`}</code>
        </pre>
      </div>
    </div>
  );
}
