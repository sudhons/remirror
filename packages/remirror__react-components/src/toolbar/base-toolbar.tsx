import React, { FC } from 'react';
import { Stack, StackProps } from '@mui/material';

export const Toolbar: FC<StackProps> = (props) => {
  return <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }} {...props} />
}
