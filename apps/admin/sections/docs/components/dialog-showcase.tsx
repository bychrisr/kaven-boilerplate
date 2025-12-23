'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { TextField } from '@/components/ui/text-field';

export default function DialogShowcase() {
  const [simpleOpen, setSimpleOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dialog Component</h2>
        <p className="text-gray-600 mb-6">
          Dialogs inform users about a task and can contain critical information or require decisions.
        </p>
      </div>

      {/* Simple Dialog */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Simple Dialog</h3>
        <Button variant="contained" color="primary" onClick={() => setSimpleOpen(true)}>
          Open Simple Dialog
        </Button>

        <Dialog open={simpleOpen} onOpenChange={setSimpleOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Simple Dialog</DialogTitle>
              <DialogDescription>
                This is a simple dialog with a title and description.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600">
                Dialogs are used to display important information or request user input.
                They appear on top of the main content and require user interaction.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outlined" onClick={() => setSimpleOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={() => setSimpleOpen(false)}>
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Form Dialog */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Dialog</h3>
        <Button variant="contained" color="primary" onClick={() => setFormOpen(true)}>
          Open Form Dialog
        </Button>

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Fill in the form below to create a new user account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <TextField label="Name" placeholder="John Doe" fullWidth />
              <TextField label="Email" type="email" placeholder="john@example.com" fullWidth />
              <TextField label="Role" placeholder="Admin" fullWidth />
            </div>
            <DialogFooter>
              <Button variant="outlined" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={() => setFormOpen(false)}>
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Confirmation Dialog */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmation Dialog</h3>
        <Button variant="contained" color="error" onClick={() => setConfirmOpen(true)}>
          Delete Item
        </Button>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this item? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outlined" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={() => setConfirmOpen(false)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Code Example */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Example</h3>
        <pre className="text-sm text-gray-800 overflow-x-auto">
          <code>{`import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Dialog</Button>

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content...</p>
  </DialogContent>
</Dialog>`}</code>
        </pre>
      </div>
    </div>
  );
}
