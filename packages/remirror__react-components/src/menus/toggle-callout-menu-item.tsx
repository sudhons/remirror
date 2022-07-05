import React, {FC, useCallback} from 'react';
import { CalloutExtension, CalloutExtensionAttributes } from 'remirror/extensions';
import { useActive, useCommands } from '@remirror/react-core';

import { BaseCommandMenuItem, BaseCommandMenuItemProps } from './base-command-menu-item';

export interface ToggleCalloutMenuItemProps
  extends Omit<
    BaseCommandMenuItemProps,
    'commandName' | 'active' | 'enabled' | 'attrs' | 'onSelect'
  > {
  attrs?: Partial<CalloutExtensionAttributes>;
}

export const ToggleCalloutMenuItem: FC<ToggleCalloutMenuItemProps> = ({ attrs , ...rest }) => {
  const { toggleCallout } = useCommands<CalloutExtension>();

  const handleSelect = useCallback(() => {
    if (toggleCallout.enabled(attrs)) {
      toggleCallout(attrs);
    }
  }, [toggleCallout, attrs]);

  const active = useActive<CalloutExtension>().callout(attrs);
  const enabled = toggleCallout.enabled(attrs);

  return (
    <BaseCommandMenuItem
      {...rest}
      commandName='toggleCallout'
      active={active}
      enabled={enabled}
      attrs={attrs}
      onSelect={handleSelect}
    />
  );
};
