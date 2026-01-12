'use client';

import { useState } from 'react';
import { TextField } from '@/components/ui/text-field';
import { Search, Mail, Lock } from 'lucide-react';

export default function TextFieldShowcase() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">TextField Component</h2>
        <p className="text-gray-600 mb-6">
          Text fields let users enter and edit text. They typically appear in forms and dialogs.
        </p>
      </div>

      {/* Variants */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField variant="outlined" label="Outlined" placeholder="Enter text..." fullWidth />
          <TextField variant="filled" label="Filled" placeholder="Enter text..." fullWidth />
          <TextField variant="standard" label="Standard" placeholder="Enter text..." fullWidth />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField size="sm" label="Small" placeholder="Small size..." fullWidth />
          <TextField size="md" label="Medium" placeholder="Medium size..." fullWidth />
          <TextField size="lg" label="Large" placeholder="Large size..." fullWidth />
        </div>
      </div>

      {/* With Icons */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">With Icons</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startAdornment={<Mail className="h-5 w-5 text-gray-400" />}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startAdornment={<Lock className="h-5 w-5 text-gray-400" />}
            fullWidth
          />
          <TextField
            label="Search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            endAdornment={<Search className="h-5 w-5 text-gray-400" />}
            fullWidth
          />
        </div>
      </div>

      {/* States */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">States</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField label="Default" placeholder="Enter text..." fullWidth />
          <TextField label="Disabled" placeholder="Disabled..." disabled fullWidth />
          <TextField
            label="Error"
            placeholder="Enter text..."
            value={error}
            onChange={(e) => setError(e.target.value)}
            error={!!error}
            errorMessage={error ? 'This field has an error' : undefined}
            fullWidth
          />
        </div>
      </div>

      {/* Helper Text */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Helper Text</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Username"
            placeholder="johndoe"
            helperText="Choose a unique username"
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            placeholder="••••••••"
            helperText="Must be at least 8 characters"
            fullWidth
          />
        </div>
      </div>

      {/* Multiline */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Multiline (Textarea)</h3>
        <TextField
          label="Description"
          placeholder="Enter a detailed description..."
          multiline
          rows={4}
          fullWidth
        />
      </div>

      {/* Code Example */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Example</h3>
        <pre className="text-sm text-gray-800 overflow-x-auto">
          <code>{`import { TextField } from '@/components/ui/text-field';
import { Mail } from 'lucide-react';

<TextField
  label="Email"
  type="email"
  placeholder="you@example.com"
  startAdornment={<Mail className="h-5 w-5" />}
  fullWidth
/>`}</code>
        </pre>
      </div>
    </div>
  );
}
