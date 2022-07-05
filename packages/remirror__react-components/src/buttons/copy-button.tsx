import React, { FC, useCallback } from 'react';
import { useCurrentSelection, useCommands } from '@remirror/react-core';

import { BaseCommandButton, BaseCommandButtonProps } from './base-command-button';

export interface CopyButtonProps
  extends Omit<
    BaseCommandButtonProps,
    'commandName' | 'active' | 'enabled' | 'attrs' | 'onSelect'
  > {}

export const CopyButton: FC<CopyButtonProps> = (props) => {
  const { copy } = useCommands();
  // Force component update on selection change
  useCurrentSelection();

  const handleSelect = useCallback(() => {
    if (copy.enabled()) {
      copy();
    }
  }, [copy]);

  const enabled = copy.enabled();

  return (
    <BaseCommandButton
      {...props}
      commandName='copy'
      active={false}
      enabled={enabled}
      onSelect={handleSelect}
    />
  );
};
