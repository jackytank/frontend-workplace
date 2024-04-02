import { Divider, List } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/config-store';
import { setTrains } from '../../../redux/reducers/timetable.reducer';
import VisibleTrainItem from './components/VisibleTrainItem';
import VisibleTrainPanel from './components/VisibleTrainPanel';
import useCreateDirectionHandler from './hooks/useCreateDirectionHandler';
import { filterRenderableTrains } from './services';
import { PlatformStation, Station } from '../chart/types';

type Props = {
  stations: (Station & PlatformStation)[];
};

const Direction: React.FC<Props> = ({ stations }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    trainDirection: trainDirectionOptions,
    dataType: dataTypeOptions,
    optionVisibleTrainExtra: visibleTrainExtraOptions
  } = useSelector((state: RootState) => state.visibleTrainReducer);
  const { sourceTrains } = useSelector((state: RootState) => state.trainReducer);
  const { options, handlers } = useCreateDirectionHandler({ trainDirectionOptions });

  useEffect(() => {
    dispatch(
      setTrains(
        filterRenderableTrains(sourceTrains, stations, {
          dataTypeOptions,
          trainDirectionOptions,
          visibleTrainExtraOptions
        })
      )
    );
  }, [trainDirectionOptions]);

  return (
    <VisibleTrainPanel header={t('visibleTrainsDirection')}>
      <List>
        <VisibleTrainItem
          handler={handlers.onClickOptionAll}
          label={t('visibleTrainsDirectionAllLine')}
          checked={options.all}
        />
        <Divider variant="middle" />
        <VisibleTrainItem
          handler={handlers.onClickOptionUp}
          label={t('visibleTrainsOptionDirectionUp')}
          checked={options.up}
        />
        <VisibleTrainItem
          handler={handlers.onClickOptionDown}
          label={t('visibleTrainsOptionDirectionDown')}
          checked={options.down}
        />
      </List>
    </VisibleTrainPanel>
  );
};

export default Direction;
