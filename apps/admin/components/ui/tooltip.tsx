"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipRoot = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      // Base styles
      "z-[100000] overflow-hidden rounded-xl px-4 py-3 text-sm",
      // Glassmorphism dark mode
      "bg-gradient-to-br from-gray-900/95 to-gray-800/95",
      "backdrop-blur-md",
      "border border-gray-600/30",
      "shadow-2xl ring-1 ring-gray-700/20",
      // Text
      "text-white",
      // Animation
      "animate-in fade-in-0 zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2",
      "data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2",
      "data-[side=top]:slide-in-from-bottom-2",
      // Width constraints
      "min-w-[200px] max-w-[320px]",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Componente simplificado para uso direto (compatível com a API anterior)
interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
  className?: string;
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  disabled = false,
  className,
  delay = 200,
}) => {
  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <TooltipRoot delayDuration={delay}>
      <TooltipTrigger asChild>
        <div className={cn("inline-block", className)}>{children}</div>
      </TooltipTrigger>
      <TooltipPrimitive.Portal>
        <TooltipContent 
          side={position}
          collisionPadding={20}
          avoidCollisions={true}
        >
          <p className="whitespace-normal break-words">{content}</p>
        </TooltipContent>
      </TooltipPrimitive.Portal>
    </TooltipRoot>
  );
};

export { Tooltip, TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent };
export default Tooltip;
