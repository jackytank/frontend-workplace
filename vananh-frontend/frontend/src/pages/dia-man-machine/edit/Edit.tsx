import {
  HvVerticalNavigationAction,
  HvVerticalNavigationActions
} from '@hitachivantara/uikit-react-core';
import { Redo, Reset, Undo } from '@hitachivantara/uikit-react-icons';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/config-store';
import { CommandInvoker } from '../services';
import { TrafficRestrictionData } from '../traffic-restriction/TrafficRestriction';
import './edit.css';
import { ResetCommand } from './services';
import { PlatformStation, Station } from '../chart/types';

type Props = {
  commandInvoker: CommandInvoker;
  stations: (Station & PlatformStation)[],
  setTrafficRestrictions: Dispatch<SetStateAction<TrafficRestrictionData[]>>;
};

const Edit: React.FC<Props> = ({ stations, commandInvoker, setTrafficRestrictions }) => {
  const { t } = useTranslation();
  const { sourceTrains } = useSelector((state: RootState) => state.trainReducer);
  const { trainDirection, dataType, optionVisibleTrainExtra } = useSelector((state: RootState) => state.visibleTrainReducer);

  const dispatch = useDispatch();

  const onClickReset = () => {
    const command = new ResetCommand(
      sourceTrains,
      stations,
      {
        dataType,
        trainDirection,
        optionVisibleTrainExtra
      },
      {
        dispatch,
        setTrafficRestrictions
      }
    );
    commandInvoker.reset(command);
  };

  return (
    <HvVerticalNavigationActions>
      <HvVerticalNavigationAction
        className={`edit-btn ${commandInvoker.isHistoryEmpty ? 'disabled' : ''}`}
        onClick={commandInvoker.undoLastCommand.bind(commandInvoker)}
        icon={<Undo />}
        label={t('undo')}
      />
      <HvVerticalNavigationAction
        className={`edit-btn ${commandInvoker.isUndoHistoryEmpty ? 'disabled' : ''}`}
        onClick={commandInvoker.redoLastCommand.bind(commandInvoker)}
        icon={<Redo />}
        label={t('redo')}
      />
      <HvVerticalNavigationAction
        className="edit-btn"
        onClick={onClickReset}
        icon={<Reset />}
        label={t('reset')}
      />
    </HvVerticalNavigationActions>
  );
};

export default Edit;
