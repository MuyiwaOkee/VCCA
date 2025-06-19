"use client"
import {
  offset,
  safePolygon,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { Button, Tooltip, Utility } from '@visa/nova-react';
import { useState } from 'react';

type Props = {
    children: React.ReactNode,
    tooltipText: string
}

export const TopTooltip = ({ children, tooltipText }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, strategy, refs, context } = useFloating({
    middleware: [offset(2)],
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
  });

  const dismiss = useDismiss(context);
  const focus = useFocus(context);
  const hover = useHover(context, { handleClose: safePolygon(), move: false });
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, focus, hover, role]);

  return (
    <Utility vFlex vJustifyContent="center">
      <Button ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </Button>
      {isOpen && (
        <Tooltip
          ref={refs.setFloating}
          style={{
            left: x,
            position: strategy,
            top: y,
            width: 'fit-content',
          }}
          {...getFloatingProps()}
        >
          {tooltipText}
        </Tooltip>
      )}
    </Utility>
  );
};