import { Popper, PopperProps } from '@mui/material';
import React, { CSSProperties, FC, RefCallback, useCallback, useMemo, useState } from 'react';
import { usePositioner } from '@remirror/react-hooks';

import { FormattingButtonGroup } from '../button-groups';
import { Toolbar } from './base-toolbar';

const DEFAULT_MODIFIERS = [{
  name: 'offset',
  options: {
    offset: [0, 8]
  }
}];

export interface FloatingToolbarProps extends PopperProps {}

export const FloatingToolbar: FC<FloatingToolbarProps> = ({ children, ...rest }) => {
  const { ref, x, y, width, height, active } = usePositioner('selection');
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const inlineStyle: CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      pointerEvents: 'none',
      left: x,
      top: y,
      width,
      height,
    }),
    [x, y, width, height],
  );

  const combinedSelectionRefs: RefCallback<HTMLDivElement> = useCallback(
    elem => {
      setAnchorEl(elem);
      ref?.(elem);
    },
    [ref],
  );

  return (
    <>
      <div ref={combinedSelectionRefs} style={inlineStyle} />
      <Popper
        placement='top'
        modifiers={DEFAULT_MODIFIERS}
        {...rest}
        open={active}
        anchorEl={anchorEl}
      >
        <Toolbar>
          {children ? <>{children}</> : <FormattingButtonGroup />}
        </Toolbar>
      </Popper>
    </>
  );
}
