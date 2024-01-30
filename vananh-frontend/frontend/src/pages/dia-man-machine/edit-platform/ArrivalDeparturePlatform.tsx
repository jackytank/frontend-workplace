import { HvButton, HvGrid, HvInput } from '@hitachivantara/uikit-react-core';
import { Box } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/config-store';
import { CommandInvoker } from '../services';
import { useValidationEditPlatform } from './hooks/useValidationEditPlatform';
import { EditPlatformCommand } from './services/command';
import { useTranslation } from 'react-i18next';

export interface TrainType {
  trainTypeCode: number;
  type: number;
  companyName: string;
}

type Props = {
  setOpenNav: Dispatch<SetStateAction<boolean>>;
  commandInvoker: CommandInvoker;
  trainTypeData: TrainType[];
};

const ArrivalDeparturePlatform: React.FC<Props> = ({
  setOpenNav,
  commandInvoker,
  trainTypeData
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.editArrivalDeparturePlatformReducer);
  const { sourceTrains } = useSelector((state: RootState) => state.trainReducer);
  const { validateFormData } = useValidationEditPlatform();

  const onSubmitEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const originalTrain = sourceTrains.predictedTrainRuns.find(
      (t) => t.trainNo === Number(formData?.train?.trainNo)
    );
    if (!validateFormData(trainTypeData, formData, originalTrain)) {
      return;
    }
    const command = new EditPlatformCommand(formData!, originalTrain!, dispatch);
    commandInvoker.executeCommand(command);
  };

  return (
    <HvGrid container columns="auto" style={{ maxWidth: '400px' }}>
      <HvGrid item xs={12}>
        <Box display={'flex'} flexDirection={'column'} gap={'15px'}>
          <HvInput
            description="Select train line"
            readOnly
            label="Train Line"
            status="valid"
            value={formData?.train?.trainNoName || ''}
          />
          <HvInput
            description="Select station"
            readOnly
            label="Station"
            status="valid"
            value={formData?.station?.stationName || ''}
          />
          <HvInput
            description="Select platform"
            readOnly
            label="Platform"
            status="valid"
            value={formData?.platform?.trackName || ''}
          />
        </Box>
      </HvGrid>

      <HvGrid item xs={12}>
        <HvButton onClick={onSubmitEdit} variant="primary">
          {t('set')}
        </HvButton>
        <HvButton onClick={() => setOpenNav(false)} variant="primary">
          {t('discard')}
        </HvButton>
      </HvGrid>
    </HvGrid>
  );
};

export default ArrivalDeparturePlatform;
