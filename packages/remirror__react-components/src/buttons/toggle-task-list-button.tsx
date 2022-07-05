import React, {FC, useCallback} from 'react';
import { TaskListExtension } from 'remirror/extensions';
import { useActive, useCommands } from '@remirror/react-core';

import { BaseCommandButton, BaseCommandButtonProps } from './base-command-button';

export interface ToggleTaskListButtonProps
  extends Omit<
    BaseCommandButtonProps,
    'commandName' | 'active' | 'enabled' | 'attrs' | 'onSelect'
  > {}

export const ToggleTaskListButton: FC<ToggleTaskListButtonProps> = (props) => {
  const { toggleTaskList } = useCommands<TaskListExtension>();

  const handleSelect = useCallback(() => {
    if (toggleTaskList.enabled()) {
      toggleTaskList();
    }
  }, [toggleTaskList]);

  const active = useActive<TaskListExtension>().taskList();
  const enabled = toggleTaskList.enabled();

  return (
    <BaseCommandButton
      {...props}
      commandName='toggleTaskList'
      active={active}
      enabled={enabled}
      onSelect={handleSelect}
    />
  );
};
