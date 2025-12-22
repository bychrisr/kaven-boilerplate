import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ClickAwayListenerProps {
  /**
   * Callback when clicked outside
   */
  onClickAway: (event: MouseEvent | TouchEvent) => void;
  /**
   * Mouse event type
   * @default 'onClick'
   */
  mouseEvent?: 'onClick' | 'onMouseDown' | 'onMouseUp' | false;
  /**
   * Touch event type
   * @default 'onTouchEnd'
   */
  touchEvent?: 'onTouchStart' | 'onTouchEnd' | false;
  /**
   * Disable listener
   */
  disableReactTree?: boolean;
  children: React.ReactElement;
}

export const ClickAwayListener: React.FC<ClickAwayListenerProps> = ({
  onClickAway,
  mouseEvent = 'onClick',
  touchEvent = 'onTouchEnd',
  disableReactTree = false,
  children,
}) => {
  const nodeRef = React.useRef<HTMLElement>(null);
  const activatedRef = React.useRef(false);

  React.useEffect(() => {
    const handleClickAway = (event: MouseEvent | TouchEvent) => {
      if (!activatedRef.current) {
        activatedRef.current = true;
        return;
      }

      if (!nodeRef.current || nodeRef.current.contains(event.target as Node)) {
        return;
      }

      onClickAway(event);
    };

    const mouseEventMap = {
      onClick: 'click',
      onMouseDown: 'mousedown',
      onMouseUp: 'mouseup',
    };

    const touchEventMap = {
      onTouchStart: 'touchstart',
      onTouchEnd: 'touchend',
    };

    if (mouseEvent) {
      document.addEventListener(mouseEventMap[mouseEvent], handleClickAway as EventListener);
    }

    if (touchEvent) {
      document.addEventListener(touchEventMap[touchEvent], handleClickAway as EventListener);
    }

    return () => {
      if (mouseEvent) {
        document.removeEventListener(mouseEventMap[mouseEvent], handleClickAway as EventListener);
      }
      if (touchEvent) {
        document.removeEventListener(touchEventMap[touchEvent], handleClickAway as EventListener);
      }
    };
  }, [onClickAway, mouseEvent, touchEvent]);

  const handleRef = (node: HTMLElement | null) => {
    nodeRef.current = node;
  };

  return React.cloneElement(children, {
    ref: handleRef,
  } as any);
};

ClickAwayListener.displayName = 'ClickAwayListener';
