import { List } from '@mui/material';
import { useTranslation } from 'react-i18next';
import VisibleTrainItem from './components/VisibleTrainItem';
import VisibleTrainPanel from './components/VisibleTrainPanel';
import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { PlatformStation, Station, TrainPassengerFlow } from '../chart/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/config-store';

import { setTrains } from '../../../redux/reducers/timetable.reducer';
import { filterRenderableTrains } from './services';
import useCreateExtraOptionsHandler from './hooks/useCreateExtraOptionsHandler';

type Props = { svgRef; stations: (Station & PlatformStation)[] };

const Operation: React.FC<Props> = ({ svgRef, stations }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    trainDirection: trainDirectionOptions,
    dataType: dataTypeOptions,
    optionVisibleTrainExtra: visibleTrainExtraOptions
  } = useSelector((state: RootState) => state.visibleTrainReducer);
  const { sourceTrains } = useSelector((state: RootState) => state.trainReducer);
  const { options, handlers } = useCreateExtraOptionsHandler({ visibleTrainExtraOptions, svgRef });
  const svg = d3.select(svgRef.current);

  useEffect(() => {
    if (options.showPassengerFlow) {
      svg.attr('display-passenger-flow', TrainPassengerFlow.ON);
    }

    dispatch(
      setTrains(
        filterRenderableTrains(sourceTrains, stations, {
          dataTypeOptions,
          trainDirectionOptions,
          visibleTrainExtraOptions
        })
      )
    );
  }, [visibleTrainExtraOptions]);

  return (
    <VisibleTrainPanel header={t('visibleTrainsOption')}>
      <List>
        <VisibleTrainItem label={t('visibleTrainsOptionOrganized')} />
        <VisibleTrainItem label={t('visibleTrainsOptionConsistency')} />
        <VisibleTrainItem
          label={t('visibleTrainsOptionTrain')}
          handler={handlers.onClickLimitDisplayedTrains}
          checked={options.limitDisplayedTrains}
        />
        <VisibleTrainItem
          label={t('visibleTrainsOptionPassengerFlow')}
          handler={handlers.onClickPassengerFlow}
          checked={options.showPassengerFlow}
        />
      </List>
    </VisibleTrainPanel>
  );
};

export default Operation;
