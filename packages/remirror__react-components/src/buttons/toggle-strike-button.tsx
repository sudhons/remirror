import React, { FC, useCallback } from 'react';
import { StrikeExtension } from 'remirror/extensions';
import { useActive, useCommands } from '@remirror/react-core';

import { BaseCommandButton, BaseCommandButtonProps } from './base-command-button';

export interface ToggleStrikeButtonProps
  extends Omit<
    BaseCommandButtonProps,
    'commandName' | 'active' | 'enabled' | 'attrs' | 'onSelect'
  > {}

export const ToggleStrikeButton: FC<ToggleStrikeButtonProps> = (props) => {
  const { toggleStrike } = useCommands<StrikeExtension>();

  const handleSelect = useCallback(() => {
    if (toggleStrike.enabled()) {
      toggleStrike();
    }
  }, [toggleStrike]);

  const active = useActive<StrikeExtension>().strike();
  const enabled = toggleStrike.enabled();

  return (
    <BaseCommandButton
      {...props}
      commandName='toggleStrike'
      active={active}
      enabled={enabled}
      onSelect={handleSelect}
    />
  );
};
