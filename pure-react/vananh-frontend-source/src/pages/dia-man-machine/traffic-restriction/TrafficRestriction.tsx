import {
  HvButton,
  HvDropdown,
  HvGrid,
  HvRadio,
  HvRadioGroup,
  HvTypography
} from '@hitachivantara/uikit-react-core';
import NumericInput from 'react-numeric-input';
import { Dispatch, FC, SetStateAction, useMemo, useRef, useState } from 'react';
import './TrafficRestriction.css';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/config-store';
import { TimeState } from '../../../redux/reducers/timetable.reducer';
import { PlatformStation, Station } from '../chart/types';
import { AddTrafficRestrictionCommand } from './services/command';
import { CommandInvoker } from '../services';
import useTRANotification from '../../../hooks/useNotification';

export enum Disruption {
  SLOW_DOWN = 0,
  SUSPEND = 1
}

export enum Line {
  LOCAL = 0,
  EXPRESS = 1
}

export enum Direction {
  UP = 0,
  DOWN = 1,
  BOTH = 2
}

export interface TrafficRestrictionData {
  disruption: Disruption;
  timeRange: { start: TimeState; end: TimeState };
  stationRange: {
    start: number;
    end: number;
  };
  direction: string;
  line: string;
  speed?: number;
  id: string;
}

type TrafficRestrictionForm = Omit<TrafficRestrictionData, 'disruption' | 'id'>;

interface TrafficRestrictionProps {
  stations: (Station & PlatformStation)[];
  setOpenNav: Dispatch<SetStateAction<boolean>>;
  trafficRestrictions: TrafficRestrictionData[];
  setTrafficRestrictions: Dispatch<SetStateAction<TrafficRestrictionData[]>>;
  commandInvoker: CommandInvoker;
}

const TrafficRestriction: FC<TrafficRestrictionProps> = ({
  stations,
  setOpenNav,
  trafficRestrictions,
  setTrafficRestrictions,
  commandInvoker
}) => {
  const { t } = useTranslation();
  const { createNotification } = useTRANotification();
  const { companyName, time } = useSelector((state: RootState) => state.timetableReducer);
  const { simRailRoads } = useSelector((state: RootState) => state.railRoadReducer);

  const stationList = useMemo(
    () =>
      stations
        .filter((s) => !s.isPlatform)
        .map((s) => ({
          stationCode: s.stationCode,
          stationName: s.stationName
        })),
    [stations]
  );

  const formRef = useRef<TrafficRestrictionForm>({
    timeRange: {
      start: {
        hour:
          trafficRestrictions[trafficRestrictions.length - 1]?.timeRange.start.hour || time.hour,
        minute:
          trafficRestrictions[trafficRestrictions.length - 1]?.timeRange.start.minute || time.minute
      },
      end: {
        hour: trafficRestrictions[trafficRestrictions.length - 1]?.timeRange.end.hour || time.hour,
        minute:
          trafficRestrictions[trafficRestrictions.length - 1]?.timeRange.end.minute || time.minute
      }
    },
    stationRange: {
      start: trafficRestrictions[trafficRestrictions.length - 1]?.stationRange.start || 0,
      end: trafficRestrictions[trafficRestrictions.length - 1]?.stationRange.end || 30
    },
    direction: '2',
    line: 'local',
    speed: 25
  });

  const onTrafficRestrictionClicked = () => {
    const { start, end } = formRef.current.timeRange;
    if (start.hour * 60 + start.minute >= end.hour * 60 + end.minute) {
      createNotification(t('restrictionValidationTimeRange'), { variant: 'error' });
      return;
    }
    const { stationRange } = formRef.current;
    if (stationRange.start === stationRange.end) {
      createNotification(t('restrictionValidationStationRange'), { variant: 'error' });
      return;
    }

    if (stationRange.start > stationRange.end) {
      const temp = stationRange.start;
      stationRange.start = stationRange.end;
      stationRange.end = temp;
    }
    const tfRestriction = {
      ...formRef.current,
      disruption: selectedDisruptionSetting,
      id: `${stationRange.start}-${stationRange.end}-${start.hour}-${start.minute}-${end.hour}-${end.minute}`
    };
    if (selectedDisruptionSetting === Disruption.SUSPEND) {
      delete tfRestriction.speed;
    }

    const command = new AddTrafficRestrictionCommand(setTrafficRestrictions, tfRestriction);
    commandInvoker.executeCommand(command);
    setOpenNav(false); // Close navigation panel after set traffic restriction.
  };

  const [selectedDisruptionSetting, setDisruptionSetting] = useState(Disruption.SUSPEND);

  return (
    <div style={{ marginTop: 10 }}>
      <HvGrid container columns="auto" style={{ maxWidth: '400px' }}>
        {/* Line 0 */}
        <HvGrid item xs={5}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('disruptionSetting')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={7} style={{ paddingLeft: '0px' }}>
          <HvRadioGroup orientation="horizontal">
            <HvRadio
              label={t('slowDown')}
              value={'1'}
              onChange={() => setDisruptionSetting(Disruption.SLOW_DOWN)}
            />
            <HvRadio
              checked
              label={t('suspend')}
              value={'2'}
              onChange={() => setDisruptionSetting(Disruption.SUSPEND)}
            />
          </HvRadioGroup>
        </HvGrid>

        {/* Line 0.1 */}
        {selectedDisruptionSetting === Disruption.SLOW_DOWN && (
          <>
            <HvGrid item xs={1}></HvGrid>
            <HvGrid item xs={4} style={{ paddingTop: '5px', height: '37px' }}>
              <HvTypography
                variant="label"
                style={{
                  marginLeft: 2,
                  marginTop: 5,
                  display: 'inline-table'
                }}>
                {t('speed')}
              </HvTypography>
            </HvGrid>
            <HvGrid item xs={7} style={{ paddingLeft: '0px', paddingTop: '6px' }}>
              <div className={'field-time'}>
                <NumericInput
                  onChange={(e) => (formRef.current.speed = e!)}
                  value={formRef.current.speed}
                  id="hour"
                  className="speed"
                  min={0}
                />
              </div>

              <HvTypography
                variant="label"
                style={{
                  marginLeft: 5,
                  marginTop: 5,
                  display: 'inline-table'
                }}>
                km/h
              </HvTypography>
            </HvGrid>
          </>
        )}
        {/* Line 1 */}
        <HvGrid item xs={12} style={{ paddingTop: '5px', height: '37px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('timeZone')}
          </HvTypography>
        </HvGrid>
        {/* Line 2 */}
        <HvGrid item xs={1}></HvGrid>
        <HvGrid item xs={4} style={{ paddingTop: '5px', height: '37px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('startTime')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={7} style={{ paddingLeft: '0px', paddingTop: '6px' }}>
          <div className={'field-time'}>
            <NumericInput
              onChange={(e) => (formRef.current.timeRange.start.hour = e!)}
              value={formRef.current.timeRange.start.hour}
              id="hour"
              className={'number-input'}
              min={0}
              max={27}
            />
          </div>
          <div className={'field-time'} style={{ paddingLeft: 15 }}>
            <NumericInput
              onChange={(e) => (formRef.current.timeRange.start.minute = e!)}
              value={formRef.current.timeRange.start.minute}
              id="minus"
              className={'number-input-minus'}
              min={0}
              max={59}
            />
          </div>
        </HvGrid>
        {/* Line 3 */}
        <HvGrid item xs={1}></HvGrid>
        <HvGrid item xs={4} style={{ paddingTop: '5px', height: '37px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('endTime')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={7} style={{ paddingLeft: '0px', paddingTop: '6px' }}>
          <div className={'field-time'}>
            <NumericInput
              onChange={(e) => (formRef.current.timeRange.end.hour = e!)}
              value={formRef.current.timeRange.end.hour}
              id="hour"
              className={'number-input'}
              min={0}
              max={27}
            />
          </div>
          <div className={'field-time'} style={{ paddingLeft: 15 }}>
            <NumericInput
              onChange={(e) => (formRef.current.timeRange.end.minute = e!)}
              value={formRef.current.timeRange.end.minute}
              id="minus"
              className={'number-input-minus'}
              min={0}
              max={59}
            />
          </div>
        </HvGrid>

        {/* Line 4 */}
        <HvGrid item xs={12} style={{ paddingTop: '5px', height: '37px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('section')}
          </HvTypography>
        </HvGrid>
        {/* Line 5 */}
        <HvGrid item xs={1}></HvGrid>
        <HvGrid item xs={4} style={{ paddingTop: '5px', height: '37px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('startStation')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={7} style={{ paddingLeft: '0px', paddingTop: '6px' }}>
          <HvDropdown
            variableWidth
            onChange={(e) => {
              if (!e || Array.isArray(e)) {
                return;
              }
              formRef.current.stationRange.start = Number(e.id);
            }}
            values={stationList.map((s) => ({
              id: s.stationCode,
              label: s.stationName,
              selected: s.stationCode === formRef.current.stationRange.start ? true : false
            }))}
            aria-label="With search"
            id="staringStation"
          />
        </HvGrid>
        {/* Line 6 */}
        <HvGrid item xs={1}></HvGrid>
        <HvGrid item xs={4} style={{ paddingTop: '5px', height: '37px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('endStation')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={7} style={{ paddingLeft: '0px', paddingTop: '6px' }}>
          <HvDropdown
            variableWidth
            onChange={(e) => {
              if (!e || Array.isArray(e)) {
                return;
              }
              formRef.current.stationRange.end = Number(e.id);
            }}
            values={stationList.map((s) => ({
              id: s.stationCode,
              label: s.stationName,
              selected: s.stationCode === formRef.current.stationRange.end ? true : false
            }))}
            aria-label="With search"
            id="terminalStation"
          />
        </HvGrid>
        {/* Line 7 */}
        <HvGrid item xs={5} style={{ paddingTop: '5px', height: '37px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('direction')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={7} style={{ paddingLeft: '0px', paddingTop: '5px', height: '37px' }}>
          <HvRadioGroup
            onChange={(e) => {
              formRef.current.direction = e.target.value;
            }}
            orientation="horizontal">
            <HvRadio label={t('up')} value={Direction.UP} />
            <HvRadio label={t('down')} value={Direction.DOWN} />
            <HvRadio checked label={t('upAndDown')} value={Direction.BOTH} />
          </HvRadioGroup>
        </HvGrid>

        {/* Line 8 */}
        <HvGrid item xs={5} style={{ paddingTop: '5px', height: '37px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('line')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={7} style={{ paddingLeft: '0px', paddingTop: '5px', height: '37px' }}>
          <HvDropdown
            onChange={(e) => {
              if (!e || Array.isArray(e)) {
                return;
              }
              formRef.current.line = e.label!.toString();
            }}
            values={simRailRoads
              .filter((r) => r.railCompany === companyName)
              .map((r) => ({
                label: r.railName,
                selected: r.railName === 'local'
              }))}
            aria-label="With search"
            id="drop11"
          />
        </HvGrid>

        {/* Line 9 */}
        <HvGrid item xs={12}>
          <HvButton onClick={onTrafficRestrictionClicked} variant="primary">
            {t('set')}
          </HvButton>
          {/* <HvButton variant="primary">{t('cancel')}</HvButton> */}
          <HvButton onClick={() => setOpenNav(false)} variant="primary">
            {t('discard')}
          </HvButton>
        </HvGrid>
      </HvGrid>
    </div>
  );
};

export default TrafficRestriction;
