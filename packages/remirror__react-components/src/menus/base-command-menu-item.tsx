import { ListItemIcon, ListItemText, MenuItem, MenuItemProps, Typography } from '@mui/material'
import React, { FC, MouseEventHandler, useCallback, ReactNode } from 'react';
import { isString } from '@remirror/core';

import { Icon } from '../icons';
import {
  useCommandOptionValues,
  UseCommandOptionValuesParams,
} from '../use-command-option-values';

export interface BaseCommandMenuItemProps
  extends MenuItemProps,
    Omit<UseCommandOptionValuesParams, 'attrs'> {
  commandName: string,
  displayShortcut?: boolean;
  onSelect: () => void;
  icon?: JSX.Element;
  attrs?: UseCommandOptionValuesParams['attrs']
  label?: NonNullable<ReactNode>;
  description?: NonNullable<ReactNode>;
  displayDescription?: boolean;
}

export const BaseCommandMenuItem: FC<BaseCommandMenuItemProps> = ({
  commandName,
  active,
  enabled,
  attrs,
  onSelect,
  onClick,
  icon,
  displayShortcut = true,
  label,
  description,
  displayDescription = true,
  ...rest
}) => {
  const handleClick: MouseEventHandler<HTMLLIElement> = useCallback(
    (e) => {
      onSelect();
      onClick?.(e);
    },
    [onSelect, onClick],
  );

  const handleMouseDown: MouseEventHandler<HTMLLIElement> = useCallback((e) => {
    e.preventDefault();
  }, []);

  const commandOptions = useCommandOptionValues({ commandName, active, enabled, attrs });

  let fallbackIcon;

  if (commandOptions.icon) {
    fallbackIcon = (
      <Icon
        name={isString(commandOptions.icon) ? commandOptions.icon : commandOptions.icon.name}
        size='1rem'
      />
    );
  }

  const primary = label ?? commandOptions.label ?? '';
  const secondary = displayDescription && (description ?? commandOptions.description);

  return (
    <MenuItem
      selected={active}
      disabled={!enabled}
      onMouseDown={handleMouseDown}
      {...rest}
      onClick={handleClick}>
      {(icon || fallbackIcon) &&
        <ListItemIcon>
          {icon ?? fallbackIcon}
        </ListItemIcon>
      }
      <ListItemText primary={primary} secondary={secondary} />
      {displayShortcut && commandOptions.shortcut &&
        <Typography variant='body2' color='text.secondary' sx={{ ml: 2 }}>
          {commandOptions.shortcut}
        </Typography>
      }
    </MenuItem>
  )
}
