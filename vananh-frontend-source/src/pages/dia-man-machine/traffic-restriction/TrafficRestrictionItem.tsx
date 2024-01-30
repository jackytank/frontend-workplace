import React, { Dispatch, SetStateAction } from 'react';
import { Disruption, TrafficRestrictionData } from './TrafficRestriction';
import { HvCard, HvCardContent, HvGrid, HvTypography } from '@hitachivantara/uikit-react-core';
import { CloseXS } from '@hitachivantara/uikit-react-icons';
import { useTranslation } from 'react-i18next';
import { Station } from '../chart/types';
import { CommandInvoker } from '../services';
import { RemoveTrafficRestrictionCommand } from './services/command';

type Props = TrafficRestrictionData & {
  stations: Station[];
  setTrafficRestrictions: Dispatch<SetStateAction<TrafficRestrictionData[]>>;
  setOpenNav: Dispatch<SetStateAction<boolean>>;
  commandInvoker: CommandInvoker;
};

const TrafficRestrictionItem = ({
  stationRange,
  speed,
  timeRange,
  disruption,
  direction,
  line,
  id,
  stations,
  setTrafficRestrictions,
  setOpenNav,
  commandInvoker
}: Props) => {
  const { t } = useTranslation();

  const onRemoveTrafficRestriction = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    const command = new RemoveTrafficRestrictionCommand(setTrafficRestrictions, id);
    commandInvoker.executeCommand(command);
    setOpenNav(false);
  };
  return (
    <HvGrid item>
      <HvCard statusColor="neutral" tabIndex={0}>
        <HvCardContent>
          <HvGrid container columnSpacing={0}>
            <HvGrid item xs={10}>
              <HvGrid container rowSpacing={0} columnSpacing={0}>
                <HvGrid item xs={6}>
                  <HvTypography style={{ fontWeight: 'bold' }} variant="caption2">
                    {t('disruptionSetting')}
                  </HvTypography>
                </HvGrid>
                <HvGrid item xs={6}>
                  <HvTypography variant="caption2">
                    {disruption === Disruption.SLOW_DOWN ? t('slowDown') : t('suspend')}
                  </HvTypography>
                </HvGrid>
                {speed && (
                  <>
                    <HvGrid item xs={6}>
                      <HvTypography style={{ fontWeight: 'bold' }} variant="caption2">
                        {t('speed')}
                      </HvTypography>
                    </HvGrid>
                    <HvGrid item xs={6}>
                      <HvTypography variant="caption2">{speed} km/h</HvTypography>
                    </HvGrid>
                  </>
                )}
                <HvGrid item xs={6}>
                  <HvTypography style={{ fontWeight: 'bold' }} variant="caption2">
                    {t('timeZone')}
                  </HvTypography>
                </HvGrid>
                <HvGrid item xs={6}>
                  <HvTypography variant="caption2">{`${timeRange.start.hour
                    .toString()
                    .padStart(2, '0')}:${timeRange.start.minute
                    .toString()
                    .padStart(2, '0')} - ${timeRange.end.hour
                    .toString()
                    .padStart(2, '0')}:${timeRange.start.minute
                    .toString()
                    .padStart(2, '0')}`}</HvTypography>
                </HvGrid>
                <HvGrid item xs={6}>
                  <HvTypography style={{ fontWeight: 'bold' }} variant="caption2">
                    {t('section')}
                  </HvTypography>
                </HvGrid>
                <HvGrid item xs={6}>
                  <HvTypography variant="caption2">{`${stations.find(
                    (s) => s.stationCode === stationRange.start
                  )?.stationName} - ${stations.find((s) => s.stationCode === stationRange.end)
                    ?.stationName}`}</HvTypography>
                </HvGrid>
                <HvGrid item xs={6}>
                  <HvTypography style={{ fontWeight: 'bold' }} variant="caption2">
                    {t('direction')}
                  </HvTypography>
                </HvGrid>
                <HvGrid item xs={6}>
                  <HvTypography variant="caption2">
                    {direction === '0' ? t('up') : direction === '1' ? t('down') : t('upAndDown')}
                  </HvTypography>
                </HvGrid>
                <HvGrid item xs={6}>
                  <HvTypography style={{ fontWeight: 'bold' }} variant="caption2">
                    {t('line')}
                  </HvTypography>
                </HvGrid>
                <HvGrid item xs={6}>
                  <HvTypography variant="caption2">{line}</HvTypography>
                </HvGrid>
              </HvGrid>
            </HvGrid>
            <HvGrid
              item
              xs={2}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <CloseXS id={id} style={{ cursor: 'pointer' }} onClick={onRemoveTrafficRestriction} />
            </HvGrid>
          </HvGrid>
        </HvCardContent>
      </HvCard>
    </HvGrid>
  );
};

export default TrafficRestrictionItem;
