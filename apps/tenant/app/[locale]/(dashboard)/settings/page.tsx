'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { useTranslation } from 'react-i18next';
import { Building, Layers, Bell } from 'lucide-react';
import { useTenant } from '@/lib/hooks/use-tenant';
import { useSpace } from '@/lib/hooks/use-space';

export default function SettingsPage() {
  const { tenant } = useTenant();
  const { spaces } = useSpace();
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Settings</h3>
        <p className="text-muted-foreground">
          Manage your tenant configuration and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
             <Building className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="spaces" className="gap-2">
             <Layers className="h-4 w-4" /> Spaces
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
             <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Generals</CardTitle>
              <CardDescription>
                Configure basic information about your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid gap-2">
                 <Label>Tenant Name</Label>
                 <Input defaultValue={tenant?.name || 'Kaven HQ'} />
               </div>
               <div className="grid gap-2">
                 <Label>Slug</Label>
                 <Input defaultValue={tenant?.slug || 'kaven-hq'} disabled />
                 <p className="text-[0.8rem] text-muted-foreground">
                    Your tenant URL is https://kaven.dev/{tenant?.slug}
                 </p>
               </div>
               <div className="flex justify-end">
                 <Button>Save Changes</Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spaces Tab (New) */}
        <TabsContent value="spaces">
          <Card>
            <CardHeader>
              <CardTitle>Spaces Configuration</CardTitle>
              <CardDescription>
                Manage your functional spaces and their default access.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {spaces.map(space => (
                      <div key={space.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                             <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                style={{ backgroundColor: space.color || '#666' }}
                             >
                                {/* We would dynamically map Lucide icons here, for now just first letter */}
                                <span className="font-bold">{space.name[0]}</span>
                             </div>
                             <div>
                                 <h4 className="font-semibold">{space.name}</h4>
                                 <p className="text-sm text-muted-foreground">code: {space.code}</p>
                             </div>
                          </div>
                          <Button variant="outline" size="sm">Configure</Button>
                      </div>
                  ))}
                  
                  <div className="pt-4 flex justify-between items-center text-sm text-muted-foreground">
                      <p>Running on Port 3001 (Tenant App)</p>
                      <Button variant="secondary">Add Space (Admin Only)</Button>
                  </div>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
           <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage how you receive updates.</CardDescription>
            </CardHeader>
            <CardContent>
               <p className="text-muted-foreground">Notification settings coming soon.</p>
            </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
