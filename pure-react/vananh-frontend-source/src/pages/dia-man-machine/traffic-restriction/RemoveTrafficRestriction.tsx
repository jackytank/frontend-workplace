import { HvGrid, HvPanel } from '@hitachivantara/uikit-react-core';
import { Dispatch, FC, SetStateAction } from 'react';
import './TrafficRestriction.css';
import { PlatformStation, Station } from '../chart/types';
import TrafficRestrictionItem from './TrafficRestrictionItem';
import { TrafficRestrictionData } from './TrafficRestriction';
import { CommandInvoker } from '../services';

interface TrafficRestrictionProps {
  stations: (Station & PlatformStation)[];
  setOpenNav: Dispatch<SetStateAction<boolean>>;
  trafficRestrictions: TrafficRestrictionData[];
  setTrafficRestrictions: Dispatch<SetStateAction<TrafficRestrictionData[]>>;
  commandInvoker: CommandInvoker;
}

const RemoveTrafficRestriction: FC<TrafficRestrictionProps> = ({
  stations,
  setOpenNav,
  trafficRestrictions,
  setTrafficRestrictions,
  commandInvoker
}) => {
  return (
    <HvPanel
      style={{
        backgroundColor: 'var(--uikit-colors-atmo1)',
        maxWidth: 400,
        overflow: 'auto',
        paddingTop: 20,
        paddingLeft: 1,
        paddingRight: 5,
        position: 'relative',
        marginTop: 10,
        height: 400
      }}
    >
      <HvGrid container columnSpacing={0} rowGap={1}>
        {trafficRestrictions.map((trafficRestriction) => (
          <TrafficRestrictionItem
            setOpenNav={setOpenNav}
            setTrafficRestrictions={setTrafficRestrictions}
            stations={stations}
            {...trafficRestriction}
            commandInvoker={commandInvoker}
          />
        ))}
      </HvGrid>
    </HvPanel>
  );
};

export default RemoveTrafficRestriction;
