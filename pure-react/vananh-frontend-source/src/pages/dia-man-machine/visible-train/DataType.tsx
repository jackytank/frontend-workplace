import { Divider, List } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/config-store';
import { setTrains } from '../../../redux/reducers/timetable.reducer';
import VisibleTrainItem from './components/VisibleTrainItem';
import VisibleTrainPanel from './components/VisibleTrainPanel';
import useCreateDataTypeHandler from './hooks/useCreateDataTypeHandler';
import { filterRenderableTrains } from './services';
import * as d3 from 'd3';
import { PlatformStation, Station } from '../chart/types';

type Props = {
  svgRef: React.RefObject<SVGSVGElement>;
  stations: (Station & PlatformStation)[];
};

const DataType: React.FC<Props> = ({ svgRef, stations }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    dataType: dataTypeOptions,
    trainDirection: trainDirectionOptions,
    optionVisibleTrainExtra: visibleTrainExtraOptions
  } = useSelector((state: RootState) => state.visibleTrainReducer);
  const { sourceTrains } = useSelector((state: RootState) => state.trainReducer);
  const { options, handlers } = useCreateDataTypeHandler({ dataTypeOptions });

  React.useEffect(() => {
    const { plannedMuted } = dataTypeOptions;
    dispatch(
      setTrains(
        filterRenderableTrains(sourceTrains, stations, {
          trainDirectionOptions,
          dataTypeOptions,
          visibleTrainExtraOptions
        })
      )
    );

    d3.select(svgRef.current)
      .select('g.planned-trains-container')
      .attr('muted', Number(plannedMuted));
  }, [dataTypeOptions]);

  return (
    <VisibleTrainPanel header={t('visibleTrainsDatatype')}>
      <List>
        <VisibleTrainItem
          handler={handlers.onClickOptionAll}
          checked={options.all}
          label={t('visibleTrainsOptionAll')}
        />
        <Divider variant="middle" />
        <VisibleTrainItem
          handler={handlers.onClickOptionPlanned}
          checked={options.planned}
          label={t('visibleTrainsOptionPlannedTimetable')}
        />
        <VisibleTrainItem
          handler={handlers.onClickOptionPlannedMuted}
          checked={options.plannedMuted}
          sxProps={{ pl: 5 }}
          label={t('visibleTrainsOptionPlannedTimetableObscure')}
        />
        <VisibleTrainItem
          handler={handlers.onClickOptionPredicted}
          checked={options.predicted}
          label={t('visibleTrainsOptionPredictedTimetable')}
        />
        <VisibleTrainItem
          handler={handlers.onClickOptionResulted}
          checked={options.resulted}
          label={t('visibleTrainsOptionOperationResultTimetable')}
        />
      </List>
    </VisibleTrainPanel>
  );
};

export default DataType;
