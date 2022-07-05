import { ToggleButton, ToggleButtonProps, Tooltip } from '@mui/material';
import React, {FC, MouseEvent, MouseEventHandler, ReactNode, useCallback} from 'react';
import { isString } from '@remirror/core';

import { Icon } from '../icons';
import {
  useCommandOptionValues,
  UseCommandOptionValuesParams,
} from '../use-command-option-values';

export interface BaseCommandButtonProps
  extends Omit<ToggleButtonProps, 'value' | 'aria-label'>,
    Omit<UseCommandOptionValuesParams, 'attrs'> {
  "aria-label"?: string;
  label?: NonNullable<ReactNode>;
  commandName: string,
  displayShortcut?: boolean;
  onSelect: () => void;
  icon?: JSX.Element;
  attrs?: UseCommandOptionValuesParams['attrs']
}

export const BaseCommandButton: FC<BaseCommandButtonProps> = ({
  commandName,
  active,
  enabled,
  attrs,
  onSelect,
  onChange,
  icon,
  displayShortcut = true,
  'aria-label': ariaLabel,
  label,
  ...rest
}) => {
  const handleChange = useCallback(
    (e: MouseEvent<HTMLElement>, value: any) => {
      onSelect();
      onChange?.(e, value);
    },
    [onSelect, onChange],
  );

  const handleMouseDown: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
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

  const labelText = ariaLabel ?? commandOptions.label ?? '';
  const tooltipText = label ?? labelText;
  const shortcutText = displayShortcut && commandOptions.shortcut ? ` (${commandOptions.shortcut})` : '';

  return (
    <Tooltip title={`${tooltipText}${shortcutText}`}>
      <ToggleButton
        aria-label={labelText}
        selected={active}
        disabled={!enabled}
        onMouseDown={handleMouseDown}
        color='primary'
        size='small'
        sx={{
          padding: '6px 12px',
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText'
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'primary.dark',
            color: 'primary.contrastText'
          },
          '&:not(:first-of-type)': {
            marginLeft: '-1px',
            borderLeft: '1px solid transparent',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
          '&:not(:last-of-type)': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
        {...rest}
        value={commandName}
        onChange={handleChange}>
        {icon ? icon : fallbackIcon}
      </ToggleButton>
    </Tooltip>
  );
};
