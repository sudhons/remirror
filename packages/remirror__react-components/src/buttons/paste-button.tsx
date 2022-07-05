import React, { FC, useCallback } from 'react';
import { useEditorState, useCommands } from '@remirror/react-core';

import { BaseCommandButton, BaseCommandButtonProps } from './base-command-button';

export interface PasteButtonProps
  extends Omit<
    BaseCommandButtonProps,
    'commandName' | 'active' | 'enabled' | 'attrs' | 'onSelect'
  > {}

export const PasteButton: FC<PasteButtonProps> = (props) => {
  const { paste } = useCommands();
  // Force component update on state change
  useEditorState();

  const handleSelect = useCallback(() => {
    if (paste.enabled()) {
      paste();
    }
  }, [paste]);

  const enabled = paste.enabled();

  return (
    <BaseCommandButton
      {...props}
      commandName='paste'
      active={false}
      enabled={enabled}
      onSelect={handleSelect}
    />
  );
};
