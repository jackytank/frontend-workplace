import { HvCheckBox } from '@hitachivantara/uikit-react-core';
import { ListItem, SxProps } from '@mui/material';
import React from 'react';

type Props = {
  label: string;
  sxProps?: SxProps;
  handler?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  checked?: boolean;
};

const VisibleTrainItem: React.FC<Props> = ({ label, sxProps, handler, checked }) => {
  return (
    <ListItem sx={{ py: 0, ...sxProps }}>
      <HvCheckBox label={label} onClick={handler} checked={checked} />
    </ListItem>
  );
};

export default VisibleTrainItem;
