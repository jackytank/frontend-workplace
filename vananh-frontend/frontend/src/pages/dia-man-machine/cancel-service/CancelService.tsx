import {
  HvButton,
  HvCheckBox,
  HvDropdown,
  HvGrid,
  HvInput,
  HvTypography
} from '@hitachivantara/uikit-react-core';
import * as d3 from 'd3';
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/config-store';
import { PlatformStation, Station, StayActiveCode, Train, TrainDirection } from '../chart/types';
import { CommandInvoker } from '../services';
import { CancelServiceCommand, DataChange } from './services/command';
import { VisibleTrainOptions } from '../../../redux/reducers/visibleTrain.reducer';
import useTRANotification from '../../../hooks/useNotification';

export interface CancelServiceData {
  trainNo: number;
  stationStartCode: number;
  stationEndCode: number;
  upDownCode: number;
}

interface CancelServiceForm {
  trainNo: number;
  trainNoName: string;
  mainShuntFlag: number;
  stationStartList: any[];
  stationStartCode: number;
  stationEndList: any[];
  stationEndCode: number;
}

interface CancelServiceProps {
  canceledTrain: any;
  stations: (Station & PlatformStation)[];
  trainTypeData: [];
  svgRef: React.RefObject<SVGSVGElement>;
  setCancelServiceDataChange: Dispatch<SetStateAction<DataChange[]>>;
  commandInvoker: CommandInvoker;
  setOpenNav: Dispatch<SetStateAction<boolean>>;
}

const CancelService: FC<CancelServiceProps> = ({
  canceledTrain,
  stations,
  trainTypeData,
  svgRef,
  setCancelServiceDataChange,
  commandInvoker,
  setOpenNav
}) => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [manualInput, setManualInput] = useState(false);
  const dispatch = useDispatch();
  const { sourceTrains } = useSelector((state: RootState) => state.trainReducer);
  const { trainDirection, dataType, optionVisibleTrainExtra } = useSelector(
    (state: RootState) => state.visibleTrainReducer
  );
  const { companyName } = useSelector((state: RootState) => state.timetableReducer);
  const [cancelServiceForm, setCancelServiceForm] = useState<CancelServiceForm>({
    trainNo: 0,
    trainNoName: '',
    mainShuntFlag: 0,
    stationStartList: [],
    stationStartCode: -1,
    stationEndList: [],
    stationEndCode: -1
  });
  const { createNotification } = useTRANotification();
  const container = d3.select(svgRef.current).select('g.predicted-trains-container');

  useEffect(() => {
    if (canceledTrain) {
      const stationStartList = canceledTrain.trainRunList.map((trainRun, index) => ({
        id: trainRun.stationCode,
        label: stations.find((station) => station.stationCode === trainRun.stationCode)
          ?.stationName,
        selected: index === 0 ? true : false
      }));
      const stationEndList = canceledTrain.trainRunList.map((trainRun, index) => ({
        id: trainRun.stationCode,
        label: stations.find((station) => station.stationCode === trainRun.stationCode)
          ?.stationName,
        selected: index === canceledTrain.trainRunList.length - 1 ? true : false
      }));
      setCancelServiceForm((cancelServiceForm) => ({
        ...cancelServiceForm,
        trainNo: canceledTrain.trainNo,
        trainNoName: canceledTrain.trainNoName,
        mainShuntFlag: canceledTrain.mainShuntFlag,
        stationStartList: stationStartList,
        stationEndList: stationEndList,
        upDownCode: canceledTrain.trainRunList[0].upDownCode
      }));
    }
  }, [canceledTrain]);

  const searchTrain = (trainNoName: string) => {
    const canceledTrain = sourceTrains.predictedTrainRuns.find(
      (train) => train.trainNoName === trainNoName
    );
    if (canceledTrain) {
      const stationStartList = canceledTrain.trainRunList.map((trainRun, index) => ({
        id: trainRun.stationCode,
        label: stations.find((station) => station.stationCode === trainRun.stationCode)
          ?.stationName,
        selected: index === 0 ? true : false
      }));
      const stationEndList = canceledTrain.trainRunList.map((trainRun, index) => ({
        id: trainRun.stationCode,
        label: stations.find((station) => station.stationCode === trainRun.stationCode)
          ?.stationName,
        selected: index === canceledTrain.trainRunList.length - 1 ? true : false
      }));
      setCancelServiceForm((cancelServiceForm) => ({
        ...cancelServiceForm,
        trainNo: canceledTrain.trainNo,
        trainNoName: canceledTrain.trainNoName,
        mainShuntFlag: canceledTrain.mainShuntFlag,
        stationStartList: stationStartList,
        stationEndList: stationEndList,
        upDownCode: canceledTrain.trainRunList[0].upDownCode
      }));
      container.select('.train-selected').classed('train-selected', false);
      container.select(`#train-no-${canceledTrain.trainNo}`).classed('train-selected', true);
    } else {
      createNotification('No train found with corresponding train number.', { variant: 'error' });
    }
  };

  const cancelServiceHandler = () => {
    const cancelServiceData: CancelServiceData = {
      trainNo: cancelServiceForm.trainNo,
      stationStartCode:
        cancelServiceForm.stationStartCode === -1 || cancelServiceForm.mainShuntFlag === 1
          ? cancelServiceForm.stationStartList[0].id
          : cancelServiceForm.stationStartCode,
      stationEndCode:
        cancelServiceForm.stationEndCode === -1 || cancelServiceForm.mainShuntFlag === 1
          ? cancelServiceForm.stationEndList.at(-1).id
          : cancelServiceForm.stationEndCode,
      upDownCode: cancelServiceForm['upDownCode']
    };
    if (
      (cancelServiceData.upDownCode === TrainDirection.DOWN &&
        cancelServiceData.stationStartCode < cancelServiceData.stationEndCode) ||
      (cancelServiceData.upDownCode === TrainDirection.UP &&
        cancelServiceData.stationStartCode > cancelServiceData.stationEndCode)
    ) {
      const command = new CancelServiceCommand(
        dispatch,
        setCancelServiceDataChange,
        cancelServiceData,
        sourceTrains,
        stations,
        trainTypeData,
        companyName,
        {
          dataType,
          trainDirection,
          optionVisibleTrainExtra
        }
      );
      commandInvoker.executeCommand(command);
      container.select(`#train-no-${cancelServiceData.trainNo}`).classed('train-selected', false);
      setOpenNav(false);
    } else {
      createNotification('The values of Starting station and Terminal station are invalid.', {
        variant: 'error'
      });
    }
  };

  return (
    <div style={{ marginTop: 10, placeItems: 'center' }}>
      <HvGrid container columns="auto" style={{ maxWidth: '400px' }}>
        <HvGrid item xs={4}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('trainNumber')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={8} style={{ paddingLeft: '0px' }}>
          <HvInput
            style={{ width: '164px' }}
            disabled={!manualInput}
            value={cancelServiceForm?.trainNoName}
            onChange={(event: any, value: string) =>
              setCancelServiceForm({ ...cancelServiceForm, trainNoName: value })
            }
            onEnter={(event: any, value: string) => searchTrain(value)}
          />
        </HvGrid>
        {/* new line */}
        <HvGrid item xs={4}></HvGrid>
        <HvGrid item xs={8} style={{ paddingLeft: '0px', paddingTop: '10px' }}>
          <HvCheckBox
            checked={manualInput}
            label={t('manualTrainNumberInput')}
            onChange={() => setManualInput(!manualInput)}
          />
        </HvGrid>
        {/* new line */}

        <HvGrid item xs={12} style={{ paddingTop: '5px', height: '37px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('stationWhereServiceCancellation')}
          </HvTypography>
        </HvGrid>
        {/* Line 1 */}
        <HvGrid item xs={1}></HvGrid>
        <HvGrid item xs={3} style={{ paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('startingStation')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={8} style={{ paddingLeft: '0px', paddingTop: '10px' }}>
          <HvDropdown
            style={{ width: 164 }}
            onChange={(selected: any) => {
              setCancelServiceForm({
                ...cancelServiceForm,
                stationStartCode: selected.id
              });
            }}
            values={cancelServiceForm.stationStartList}
          />
        </HvGrid>
        {/* Line 2 */}
        <HvGrid item xs={1}></HvGrid>
        <HvGrid item xs={3} style={{ paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('terminalStation')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={8} style={{ paddingLeft: '0px', paddingTop: '10px' }}>
          <HvDropdown
            style={{ width: 164 }}
            onChange={(selected: any) => {
              setCancelServiceForm({
                ...cancelServiceForm,
                stationEndCode: selected.id
              });
            }}
            values={cancelServiceForm.stationEndList}
          />
        </HvGrid>
        {/* Button Group */}
        <HvGrid item xs={12}>
          <HvButton onClick={cancelServiceHandler} variant="primary">
            {t('apply')}
          </HvButton>
          <HvButton onClick={() => setOpenNav(false)} variant="primary">
            {t('discard')}
          </HvButton>
        </HvGrid>
      </HvGrid>
    </div>
  );
};

export default CancelService;
