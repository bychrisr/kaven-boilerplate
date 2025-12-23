'use client';

export default function TypographyShowcase() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Typography System</h2>
        <p className="text-gray-600 mb-6">
          Typography scale and styles used throughout the application.
        </p>
      </div>

      {/* Headings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Headings</h3>
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Heading 1 (4xl)</h1>
            <code className="text-sm text-gray-500">text-4xl font-bold</code>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Heading 2 (3xl)</h2>
            <code className="text-sm text-gray-500">text-3xl font-bold</code>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Heading 3 (2xl)</h3>
            <code className="text-sm text-gray-500">text-2xl font-bold</code>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900">Heading 4 (xl)</h4>
            <code className="text-sm text-gray-500">text-xl font-semibold</code>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-gray-900">Heading 5 (lg)</h5>
            <code className="text-sm text-gray-500">text-lg font-semibold</code>
          </div>
          <div>
            <h6 className="text-base font-semibold text-gray-900">Heading 6 (base)</h6>
            <code className="text-sm text-gray-500">text-base font-semibold</code>
          </div>
        </div>
      </div>

      {/* Body Text */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Body Text</h3>
        <div className="space-y-4">
          <div>
            <p className="text-lg text-gray-900">Large body text (lg)</p>
            <code className="text-sm text-gray-500">text-lg</code>
          </div>
          <div>
            <p className="text-base text-gray-900">Regular body text (base)</p>
            <code className="text-sm text-gray-500">text-base</code>
          </div>
          <div>
            <p className="text-sm text-gray-900">Small body text (sm)</p>
            <code className="text-sm text-gray-500">text-sm</code>
          </div>
          <div>
            <p className="text-xs text-gray-900">Extra small text (xs)</p>
            <code className="text-sm text-gray-500">text-xs</code>
          </div>
        </div>
      </div>

      {/* Font Weights */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Font Weights</h3>
        <div className="space-y-2">
          <p className="text-base font-normal text-gray-900">Normal (400)</p>
          <p className="text-base font-medium text-gray-900">Medium (500)</p>
          <p className="text-base font-semibold text-gray-900">Semibold (600)</p>
          <p className="text-base font-bold text-gray-900">Bold (700)</p>
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Text Colors</h3>
        <div className="space-y-2">
          <p className="text-base text-gray-900">Primary text (gray-900)</p>
          <p className="text-base text-gray-700">Secondary text (gray-700)</p>
          <p className="text-base text-gray-600">Tertiary text (gray-600)</p>
          <p className="text-base text-gray-500">Disabled text (gray-500)</p>
          <p className="text-base text-primary-main">Primary color</p>
          <p className="text-base text-success-main">Success color</p>
          <p className="text-base text-warning-main">Warning color</p>
          <p className="text-base text-error-main">Error color</p>
        </div>
      </div>

      {/* Fonts */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Font Families</h3>
        <div className="space-y-4">
          <div>
            <p className="text-base font-sans text-gray-900">
              DM Sans (Primary) - The quick brown fox jumps over the lazy dog
            </p>
            <code className="text-sm text-gray-500">font-sans (DM Sans)</code>
          </div>
          <div>
            <p className="text-base font-mono text-gray-900">
              Monospace - The quick brown fox jumps over the lazy dog
            </p>
            <code className="text-sm text-gray-500">font-mono</code>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Example</h3>
        <pre className="text-sm text-gray-800 overflow-x-auto">
          <code>{`// Headings
<h1 className="text-4xl font-bold text-gray-900">Page Title</h1>
<h2 className="text-3xl font-bold text-gray-900">Section Title</h2>

// Body Text
<p className="text-base text-gray-700">Regular paragraph text</p>
<p className="text-sm text-gray-600">Small helper text</p>

// Colored Text
<p className="text-primary-main">Primary colored text</p>
<p className="text-error-main">Error message</p>`}</code>
        </pre>
      </div>
    </div>
  );
}
