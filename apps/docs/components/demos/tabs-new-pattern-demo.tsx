'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { Activity, Server, Database } from 'lucide-react';

export function TabsNewPatternDemo() {
  const tabTriggerClass = cn(
    "relative h-14 rounded-none bg-transparent px-0 pb-3 pt-3 font-semibold text-muted-foreground shadow-none transition-none cursor-pointer",
    "!bg-transparent !shadow-none !border-0 hover:text-foreground mx-4 first:ml-0",
    "data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:!text-foreground data-[state=active]:!border-none",
    "dark:data-[state=active]:!bg-transparent dark:data-[state=active]:!border-none",
    "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 data-[state=active]:after:scale-x-100"
  );

  return (
    <Card className="!p-0 !gap-0 block overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm dark:bg-[#212B36]/50 max-w-3xl mx-auto">
      <Tabs defaultValue="metrics" className="w-full">
          <div className="flex flex-col md:flex-row items-center w-full border-b border-border/40 gap-4">
              <TabsList className="bg-transparent p-0 h-auto gap-0 justify-start px-4 w-full flex-nowrap overflow-x-auto border-b-0 no-scrollbar">
                  <TabsTrigger value="metrics" className={tabTriggerClass}>
                      <Activity className="mr-2 h-4 w-4" />
                      Metrics
                  </TabsTrigger>
                  <TabsTrigger value="hardware" className={tabTriggerClass}>
                      <Server className="mr-2 h-4 w-4" />
                      Hardware
                  </TabsTrigger>
                  <TabsTrigger value="infrastructure" className={tabTriggerClass}>
                      <Database className="mr-2 h-4 w-4" />
                      Infrastructure
                  </TabsTrigger>
              </TabsList>
          </div>

          <div className="p-6 h-40 flex items-center justify-center bg-background/50">
              <TabsContent value="metrics" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                  <div className="text-center">
                      <h3 className="text-lg font-medium">Metrics Content</h3>
                      <p className="text-sm text-muted-foreground">Exemplo de conteúdo da aba Metrics.</p>
                  </div>
              </TabsContent>

              <TabsContent value="hardware" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                   <div className="text-center">
                      <h3 className="text-lg font-medium">Hardware Content</h3>
                      <p className="text-sm text-muted-foreground">Exemplo de conteúdo da aba Hardware.</p>
                  </div>
              </TabsContent>

              <TabsContent value="infrastructure" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                   <div className="text-center">
                      <h3 className="text-lg font-medium">Infrastructure Content</h3>
                      <p className="text-sm text-muted-foreground">Exemplo de conteúdo da aba Infrastructure.</p>
                  </div>
              </TabsContent>
          </div>
      </Tabs>
    </Card>
  );
}
