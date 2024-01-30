import { useRef } from 'react';
import {
  DataTypeOptions,
  setDataTypeOptions
} from '../../../../redux/reducers/visibleTrain.reducer';
import { useDispatch } from 'react-redux';

type Props = {
  dataTypeOptions: DataTypeOptions;
};

/**
 * Hook to control DataType form
 * And create handler for checkboxes
 */
const useCreateDataTypeHandler = ({ dataTypeOptions }: Props) => {
  const options = useRef(dataTypeOptions);
  options.current = dataTypeOptions;

  const dispatch = useDispatch();

  const onClickOptionAll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.target['checked']) {
      dispatch(
        setDataTypeOptions({
          all: true,
          predicted: true,
          resulted: true,
          planned: true,
          plannedMuted: dataTypeOptions.plannedMuted
        })
      );
      return;
    }
    dispatch(
      setDataTypeOptions({
        all: false,
        predicted: false,
        resulted: false,
        planned: false,
        plannedMuted: false
      })
    );
  };

  const onClickOptionPlanned = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.target['checked']) {
      dispatch(
        setDataTypeOptions({
          ...dataTypeOptions,
          all: dataTypeOptions.predicted && dataTypeOptions.resulted ? true : false,
          planned: true,
          plannedMuted: dataTypeOptions.plannedMuted
        })
      );
      return;
    }
    dispatch(
      setDataTypeOptions({
        ...dataTypeOptions,
        all: false,
        planned: false,
        plannedMuted: false
      })
    );
  };

  const onClickOptionPlannedMuted = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.target['checked']) {
      dispatch(
        setDataTypeOptions({
          ...dataTypeOptions,
          all: dataTypeOptions.predicted && dataTypeOptions.resulted ? true : false,
          planned: true,
          plannedMuted: true
        })
      );
      return;
    }
    dispatch(
      setDataTypeOptions({
        ...dataTypeOptions,
        plannedMuted: false
      })
    );
  };

  const onClickOptionPredicted = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.target['checked']) {
      dispatch(
        setDataTypeOptions({
          ...dataTypeOptions,
          all: dataTypeOptions.planned && dataTypeOptions.resulted ? true : false,
          predicted: true
        })
      );
      return;
    }
    dispatch(
      setDataTypeOptions({
        ...dataTypeOptions,
        all: false,
        predicted: false
      })
    );
  };

  const onClickOptionResulted = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.target['checked']) {
      dispatch(
        setDataTypeOptions({
          ...dataTypeOptions,
          all: dataTypeOptions.predicted && dataTypeOptions.planned ? true : false,
          resulted: true
        })
      );

      return;
    }
    dispatch(
      setDataTypeOptions({
        ...dataTypeOptions,
        all: false,
        resulted: false
      })
    );
  };
  return {
    options: options.current,
    handlers: {
      onClickOptionAll,
      onClickOptionPlanned,
      onClickOptionPlannedMuted,
      onClickOptionPredicted,
      onClickOptionResulted
    }
  };
};

export default useCreateDataTypeHandler;
