import React, { FC, useCallback } from 'react';
import { CodeExtension } from 'remirror/extensions';
import { useActive, useCommands } from '@remirror/react-core';

import { BaseCommandButton, BaseCommandButtonProps } from './base-command-button';

export interface ToggleCodeButtonProps
  extends Omit<
    BaseCommandButtonProps,
    'commandName' | 'active' | 'enabled' | 'attrs' | 'onSelect'
  > {}

export const ToggleCodeButton: FC<ToggleCodeButtonProps> = (props) => {
  const { toggleCode } = useCommands<CodeExtension>();

  const handleSelect = useCallback(() => {
    if (toggleCode.enabled()) {
      toggleCode();
    }
  }, [toggleCode]);

  const active = useActive<CodeExtension>().code();
  const enabled = toggleCode.enabled();

  return (
    <BaseCommandButton
      {...props}
      commandName='toggleCode'
      active={active}
      enabled={enabled}
      onSelect={handleSelect}
    />
  );
};
