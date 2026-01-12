'use client';

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, TrendingUp } from 'lucide-react';

export default function CardShowcase() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Card Component</h2>
        <p className="text-gray-600 mb-6">
          Cards contain content and actions about a single subject.
        </p>
      </div>

      {/* Basic Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Simple Card</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                This is a simple card with header and content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Card with Footer</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                This card includes a footer with actions.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="text" size="sm">Learn More</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">With Actions</h3>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Card with header actions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-primary-lighter border-primary-main">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Users</span>
                <TrendingUp className="h-4 w-4 text-success-main" />
              </div>
              <p className="text-3xl font-bold text-gray-900">1,234</p>
              <p className="text-xs text-success-main mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-success-lighter border-success-main">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Revenue</span>
                <TrendingUp className="h-4 w-4 text-success-main" />
              </div>
              <p className="text-3xl font-bold text-gray-900">$45.2K</p>
              <p className="text-xs text-success-main mt-1">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-warning-lighter border-warning-main">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Orders</span>
                <TrendingUp className="h-4 w-4 text-warning-main" />
              </div>
              <p className="text-3xl font-bold text-gray-900">567</p>
              <p className="text-xs text-warning-main mt-1">+5% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-error-lighter border-error-main">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Issues</span>
                <TrendingUp className="h-4 w-4 text-error-main" />
              </div>
              <p className="text-3xl font-bold text-gray-900">23</p>
              <p className="text-xs text-error-main mt-1">-15% from last month</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Example</h3>
        <pre className="text-sm text-gray-800 overflow-x-auto">
          <code>{`import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardContent>
    <p>Card content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`}</code>
        </pre>
      </div>
    </div>
  );
}
