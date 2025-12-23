'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ButtonShowcase from '../components/button-showcase';
import TextFieldShowcase from '../components/text-field-showcase';
import CardShowcase from '../components/card-showcase';
import AlertShowcase from '../components/alert-showcase';
import DialogShowcase from '../components/dialog-showcase';
import TypographyShowcase from '../components/typography-showcase';

export default function DocsView() {
  const [activeTab, setActiveTab] = useState('buttons');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Design System Documentation</h1>
        <p className="text-lg text-gray-600">
          Interactive showcase of Minimals Design System components
        </p>
      </div>

      {/* Main Content */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="inputs">Text Fields</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="dialogs">Dialogs</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
          </TabsList>

          <TabsContent value="buttons">
            <ButtonShowcase />
          </TabsContent>

          <TabsContent value="inputs">
            <TextFieldShowcase />
          </TabsContent>

          <TabsContent value="cards">
            <CardShowcase />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertShowcase />
          </TabsContent>

          <TabsContent value="dialogs">
            <DialogShowcase />
          </TabsContent>

          <TabsContent value="typography">
            <TypographyShowcase />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Footer */}
      <Card className="p-6 bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need more components?</h3>
          <p className="text-gray-600 mb-4">
            Check out the full component library in <code className="px-2 py-1 bg-gray-200 rounded">components/ui/</code>
          </p>
          <a
            href="https://minimals.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-main hover:text-primary-dark font-medium"
          >
            View Minimals Documentation →
          </a>
        </div>
      </Card>
    </div>
  );
}
