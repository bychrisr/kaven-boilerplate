import * as React from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  /**
   * Children to render in portal
   */
  children: React.ReactNode;
  /**
   * Container element
   */
  container?: Element | null;
  /**
   * Disable portal (render in place)
   */
  disablePortal?: boolean;
}

export const Portal: React.FC<PortalProps> = ({ children, container, disablePortal = false }) => {
  const [mountNode, setMountNode] = React.useState<Element | null>(null);

  React.useEffect(() => {
    if (!disablePortal) {
      setMountNode(container || document.body);
    }
  }, [container, disablePortal]);

  if (disablePortal) {
    return <>{children}</>;
  }

  return mountNode ? createPortal(children, mountNode) : null;
};

Portal.displayName = 'Portal';
