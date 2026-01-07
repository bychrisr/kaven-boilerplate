'use client';

import * as React from 'react';

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
  disableReactTree = false, // eslint-disable-line @typescript-eslint/no-unused-vars
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

  const handleRef = React.useCallback(
    (node: HTMLElement | null) => {
      nodeRef.current = node;

      // Preserve existing ref if present
      const childRef = (children as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof childRef === 'function') {
        childRef(node);
      } else if (childRef) {
        // eslint-disable-next-line
        (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    [children]
  );

  return React.cloneElement(children, {
    ref: handleRef,
  } as React.Attributes);
};

ClickAwayListener.displayName = 'ClickAwayListener';
