'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Something went wrong</CardTitle>
            </div>
            <CardDescription>
              An error occurred while rendering this component
            </CardDescription>
          </CardHeader>
          <CardContent>
            {this.state.error && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-mono text-muted-foreground">
                  {this.state.error.message}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              Try again
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}
