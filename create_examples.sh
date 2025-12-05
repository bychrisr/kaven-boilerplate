#!/bin/bash

# Backend server.ts example
cat > production/backend/src/server.ts << 'EOF'
import Fastify from 'fastify';

const server = Fastify({
  logger: true,
});

server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

server.get('/metrics', async () => {
  // TODO: Implement Prometheus metrics
  return 'Metrics endpoint - to be implemented';
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Server running on http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
EOF

# Frontend app layout
cat > "production/frontend/src/app/layout.tsx" << 'EOF'
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kaven Boilerplate',
  description: 'Enterprise SaaS starter',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF

# Frontend page
cat > "production/frontend/src/app/page.tsx" << 'EOF'
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Kaven Boilerplate v2.0.0</h1>
        <p className="mt-4 text-gray-600">Enterprise SaaS Starter</p>
        <p className="mt-2 text-sm text-gray-500">Backend: http://localhost:3000/health</p>
      </div>
    </main>
  );
}
EOF

# Frontend globals.css
cat > "production/frontend/src/app/globals.css" << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# tsconfig.json backend
cat > production/backend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# tsconfig.json frontend
cat > production/frontend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# next.config.js
cat > production/frontend/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

module.exports = nextConfig;
EOF

# tailwind.config.js
cat > production/frontend/tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
EOF

echo "✅ Arquivos de exemplo criados!"
