import React, { FC, useCallback } from 'react';
import { ItalicExtension } from 'remirror/extensions';
import { useActive, useCommands } from '@remirror/react-core';

import { BaseCommandButton, BaseCommandButtonProps } from './base-command-button';

export interface ToggleItalicButtonProps
  extends Omit<
    BaseCommandButtonProps,
    'commandName' | 'active' | 'enabled' | 'attrs' | 'onSelect'
  > {}

export const ToggleItalicButton: FC<ToggleItalicButtonProps> = (props) => {
  const { toggleItalic } = useCommands<ItalicExtension>();

  const handleSelect = useCallback(() => {
    if (toggleItalic.enabled()) {
      toggleItalic();
    }
  }, [toggleItalic]);

  const active = useActive<ItalicExtension>().italic();
  const enabled = toggleItalic.enabled();

  return (
    <BaseCommandButton
      {...props}
      commandName='toggleItalic'
      active={active}
      enabled={enabled}
      onSelect={handleSelect}
    />
  );
};
