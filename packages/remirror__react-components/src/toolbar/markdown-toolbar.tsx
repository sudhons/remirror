import React, { FC } from 'react';

import { CommandButtonGroup, HistoryButtonGroup } from '../button-groups';
import { ToggleBlockquoteButton, ToggleBoldButton, ToggleCodeBlockButton,ToggleCodeButton, ToggleHeadingButton, ToggleItalicButton, ToggleStrikeButton } from '../buttons';
import { Toolbar } from './base-toolbar';
import { VerticalDivider } from './vertical-divider';

const HEADING_LEVEL_1 = { level: 1 };
const HEADING_LEVEL_2 = { level: 2 };

export const MarkdownToolbar: FC = () => {
  return (
    <Toolbar>
      <CommandButtonGroup>
        <ToggleBoldButton />
        <ToggleItalicButton />
        <ToggleStrikeButton />
        <ToggleCodeButton />
      </CommandButtonGroup>
      <VerticalDivider />
      <CommandButtonGroup>
        <ToggleHeadingButton attrs={HEADING_LEVEL_1} />
        <ToggleHeadingButton attrs={HEADING_LEVEL_2} />
      </CommandButtonGroup>
      <VerticalDivider />
      <CommandButtonGroup>
        <ToggleBlockquoteButton />
        <ToggleCodeBlockButton />
      </CommandButtonGroup>
      <VerticalDivider />
      <HistoryButtonGroup />
    </Toolbar>
  )
}
