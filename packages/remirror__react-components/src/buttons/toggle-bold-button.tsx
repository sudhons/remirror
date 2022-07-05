import React, { FC, useCallback } from 'react';
import { BoldExtension } from 'remirror/extensions';
import { useActive, useCommands } from '@remirror/react-core';

import { BaseCommandButton, BaseCommandButtonProps } from './base-command-button';

export interface ToggleBoldButtonProps
  extends Omit<
    BaseCommandButtonProps,
    'commandName' | 'active' | 'enabled' | 'attrs' | 'onSelect'
  > {}

export const ToggleBoldButton: FC<ToggleBoldButtonProps> = (props) => {
  const { toggleBold } = useCommands<BoldExtension>();

  const handleSelect = useCallback(() => {
    if (toggleBold.enabled()) {
      toggleBold();
    }
  }, [toggleBold]);

  const active = useActive<BoldExtension>().bold();
  const enabled = toggleBold.enabled();

  return (
    <BaseCommandButton
      {...props}
      commandName='toggleBold'
      active={active}
      enabled={enabled}
      onSelect={handleSelect}
    />
  );
};
