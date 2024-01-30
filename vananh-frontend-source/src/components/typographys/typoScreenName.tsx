import React from 'react';
import { HvTypography } from '@hitachivantara/uikit-react-core';

interface TypoScreenNameProps {
  title: string;
  fontSize?: string;
}

const TypoScreenName: React.FC<TypoScreenNameProps> = ({ title, fontSize }) => {
  return (
    <div
      style={{
        width: '100%',
        float: 'left',
        fontSize: fontSize ? fontSize : '16px'
      }}
    >
      <HvTypography
        variant="title2"
        style={{
          fontSize: fontSize ? fontSize : '16px',
          fontWeight: 'bold'
        }}
      >
        {title}
      </HvTypography>
    </div>
  );
};

export default TypoScreenName;
