import React, { FC, useCallback } from 'react';
import { UnderlineExtension } from 'remirror/extensions';
import { useActive, useCommands } from '@remirror/react-core';

import { BaseCommandButton, BaseCommandButtonProps } from './base-command-button';

export interface ToggleUnderlineButtonProps
  extends Omit<
    BaseCommandButtonProps,
    'commandName' | 'active' | 'enabled' | 'attrs' | 'onSelect'
  > {}

export const ToggleUnderlineButton: FC<ToggleUnderlineButtonProps> = (props) => {
  const { toggleUnderline } = useCommands<UnderlineExtension>();

  const handleSelect = useCallback(() => {
    if (toggleUnderline.enabled()) {
      toggleUnderline();
    }
  }, [toggleUnderline]);

  const active = useActive<UnderlineExtension>().underline();
  const enabled = toggleUnderline.enabled();

  return (
    <BaseCommandButton
      {...props}
      commandName='toggleUnderline'
      active={active}
      enabled={enabled}
      onSelect={handleSelect}
    />
  );
};
