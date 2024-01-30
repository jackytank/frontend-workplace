import useTRANotification from '../../../../hooks/useNotification';
import { isValidDate } from '../../../../lib/utils/helper';
import { EditFormData } from '../../../../redux/reducers/edit-platform.reducer';
import { parseDateTime } from '../../chart/Chart';
import { DrawableTrain, TrainPassOrStopCode } from '../../chart/types';
import { TrainType } from '../ArrivalDeparturePlatform';

export const useValidationEditPlatform = () => {
  const { createNotification } = useTRANotification();

  const validateFormData = (
    trainTypeData: TrainType[],
    formData?: EditFormData,
    originalTrain?: DrawableTrain
  ) => {
    if (!formData || !originalTrain || !formData.train) {
      createNotification('Please select correct platform!.', { variant: 'error' });
      return false;
    }

    if (!originalTrain) {
      createNotification('Invalid trainNo.', { variant: 'error' });
      return false;
    }
    const toBeUpdateTrainRun = originalTrain.drawableTrainRunList.find(
      (t) => t.stationCode === formData.station?.stationCode
    )!;

    if (toBeUpdateTrainRun.plannedTrackCode === formData.platform?.trackCode) {
      createNotification(
        'New Arrival/Departure platform track should not be the same with current track.',
        { variant: 'error' }
      );
      return false;
    }
    const { hour, minute } = timetable.setting.time;
    const beginTime = parseDateTime(
      `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`
    );
    let date = parseDateTime(toBeUpdateTrainRun.plannedArvTime);

    if (!isValidDate(date)) {
      date = parseDateTime(toBeUpdateTrainRun.plannedDptTime);
    }
    if (date && beginTime && date < beginTime) {
      createNotification('Train Run should not be before begin time!.', { variant: 'error' });
      return false;
    }

    if (
      toBeUpdateTrainRun.passOrStopCode !== TrainPassOrStopCode.STOP ||
      toBeUpdateTrainRun.tokuhatsuFg > 0
    ) {
      createNotification(
        'Original Train Run should be stop on the station in order to update arv/dpt platform!.',
        { variant: 'error' }
      );
      return false;
    }

    const section = trainTypeData.find(
      (type) => type['trainTypeCode'] === toBeUpdateTrainRun.trainType
    )?.type;
    if (
      formData.platform?.homeTrackFg === 0 &&
      toBeUpdateTrainRun.passOrStopCode === TrainPassOrStopCode.STOP &&
      section === 1
    ) {
      createNotification('Passengers cannot stop on track without platforms.', {
        variant: 'error'
      });
      return false;
    }

    return true;
  };

  return {
    validateFormData
  };
};
