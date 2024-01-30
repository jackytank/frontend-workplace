import { HvPanel, HvTypography } from '@hitachivantara/uikit-react-core';
import React from 'react';

type Props = {
  header: string;
  children: JSX.Element;
};

const VisibleTrainPanel: React.FC<Props> = ({ header, children }) => {
  return (
    <HvPanel style={{ padding: 5 }}>
      <HvTypography>{header}</HvTypography>
      {children}
    </HvPanel>
  );
};

export default VisibleTrainPanel;
