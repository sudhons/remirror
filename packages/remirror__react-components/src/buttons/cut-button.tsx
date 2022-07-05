import React, { FC, useCallback } from 'react';
import { useCurrentSelection, useCommands } from '@remirror/react-core';

import { BaseCommandButton, BaseCommandButtonProps } from './base-command-button';

export interface CutButtonProps
  extends Omit<
    BaseCommandButtonProps,
    'commandName' | 'active' | 'enabled' | 'attrs' | 'onSelect'
  > {}

export const CutButton: FC<CutButtonProps> = (props) => {
  const { cut } = useCommands();
  // Force component update on selection change
  useCurrentSelection();

  const handleSelect = useCallback(() => {
    if (cut.enabled()) {
      cut();
    }
  }, [cut]);

  const enabled = cut.enabled();

  return (
    <BaseCommandButton
      {...props}
      commandName='cut'
      active={false}
      enabled={enabled}
      onSelect={handleSelect}
    />
  );
};
