import { HvButton, HvCheckBox } from '@hitachivantara/uikit-react-core';
import { Grid, List, ListItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/config-store';
import { setKpiMemo, setSourceTrains, setTrains } from '../../../redux/reducers/timetable.reducer';
import timetableApi from '../../../services/apis/timetableApi';
import { mapPredictTimetableData } from '../chart/services';
import { PlatformStation, Station } from '../chart/types';
import { filterRenderableTrains } from '../visible-train/services';
import { setLoading } from '../../../redux/reducers/common.reducer';

const refreshTimetable = (dispatch) =>
  new Promise((resolve) => {
    dispatch(setTrains({ predictedTrainRuns: [] }));
    resolve(null);
  });

type Props = {
  getDataTrafficRestriction: () => void;
  stations: (Station & PlatformStation)[];
};

const PredictTimeTable: React.FC<Props> = ({ getDataTrafficRestriction, stations }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { companyName } = useSelector((state: RootState) => state.timetableReducer);
  const { sourceTrains } = useSelector((state: RootState) => state.trainReducer);
  const { kpiMemo } = useSelector((state: RootState) => state.kpiMemoReducer);
  const {
    trainDirection: trainDirectionOptions,
    dataType: dataTypeOptions,
    optionVisibleTrainExtra: visibleTrainExtraOptions
  } = useSelector((state: RootState) => state.visibleTrainReducer);

  const onClickPredictTimetable = async () => {
    dispatch(
      setLoading({ state: 'loading', label: 'Preparing Predict Timetable data! Please wait...' })
    );
    try {
      const formData = await getDataTrafficRestriction();
      const predictTimetable = await timetableApi.getPredictTimetable(
        companyName,
        JSON.stringify(formData)
      );
      const predictedData = mapPredictTimetableData(
        stations,
        predictTimetable.data.trainQ,
        sourceTrains.plannedTrainRuns
      );
      dispatch(setSourceTrains({ ...sourceTrains, predictedTrainRuns: predictedData }));
      dispatch(setKpiMemo(predictTimetable.data.kpiMemo[0]));
      await refreshTimetable(dispatch);
      dispatch(
        setTrains(
          filterRenderableTrains({ ...sourceTrains, predictedTrainRuns: predictedData }, stations, {
            dataTypeOptions,
            trainDirectionOptions,
            visibleTrainExtraOptions
          })
        )
      );
    } finally {
      dispatch(setLoading({ state: 'done' }));
    }
  };
  return (
    <Grid item sx={{ bgcolor: '#FBFCFD', paddingTop: 3, paddingRight: '2px' }}>
      <div className="rowTabPanel">
        <HvButton variant="primary" onClick={onClickPredictTimetable}>
          {' '}
          {t('predictTimetable')}{' '}
        </HvButton>
        <HvButton variant="primary"> {t('loadReplayInfo')} </HvButton>
      </div>
      <div className="rowTabPanel">
        <HvButton variant="primary"> {t('operationResults')} </HvButton>
        <HvButton variant="primary"> {t('multiStageTrainingDataGeneration')} </HvButton>
      </div>
      <List>
        <ListItem>
          <HvCheckBox label={t('trainingDataGenerationMode')} checked={false} />
        </ListItem>
        <ListItem>
          <HvCheckBox label={t('frontJustfied')} checked={false} />
        </ListItem>
        <ListItem>
          <HvCheckBox label={t('stationsWithoutARS')} checked={false} />
        </ListItem>
      </List>
    </Grid>
  );
};

export default PredictTimeTable;
