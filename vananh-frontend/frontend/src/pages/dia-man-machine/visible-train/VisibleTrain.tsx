import { Grid } from '@mui/material';
import React from 'react';
import DataType from './DataType';
import Direction from './Direction';
import Operation from './Operation';
import { HvButton } from '@hitachivantara/uikit-react-core';
import VisibleTrainPanel from './components/VisibleTrainPanel';
import { useTranslation } from 'react-i18next';
import { PlatformStation, Station } from '../chart/types';

type Props = {
  svgRef: React.RefObject<SVGSVGElement>;
  stations: (Station & PlatformStation)[];
};

const VisibleTrain: React.FC<Props> = ({ svgRef, stations }) => {
  const { t } = useTranslation();

  return (
    <Grid item sx={{ bgcolor: '#FBFCFD', paddingTop: 3, paddingRight: '2px' }}>
      <VisibleTrainPanel header={t('visibleLine')}>
        <div className="rowTabPanel">
          <HvButton variant="primary"> T4-0 </HvButton>
          <HvButton variant="primary"> T4-1 </HvButton>
        </div>
      </VisibleTrainPanel>
      <DataType stations={stations} svgRef={svgRef} />
      <Direction stations={stations} />
      <Operation stations={stations} svgRef={svgRef} />
    </Grid>
  );
};

export default VisibleTrain;
