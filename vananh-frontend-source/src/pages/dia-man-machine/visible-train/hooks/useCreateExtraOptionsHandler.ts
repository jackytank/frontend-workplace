import { useRef } from 'react';
import {
  VisibleTrainExtraOptions,
  setExtraVisibleTrainOptions
} from '../../../../redux/reducers/visibleTrain.reducer';
import { useDispatch } from 'react-redux';
import * as d3 from 'd3';
import { TrainPassengerFlow } from '../../chart/types';
type Props = {
  visibleTrainExtraOptions: VisibleTrainExtraOptions,
  svgRef
};

/**
 * Hook to control Option form
 * And create handler for checkboxes
 */
const useCreateExtraOptionsHandler = ({ visibleTrainExtraOptions, svgRef }: Props) => {
  const options = useRef( visibleTrainExtraOptions);
  options.current =  visibleTrainExtraOptions;
  const svg = d3.select(svgRef.current);
  const dispatch = useDispatch();

  const onClickPassengerFlow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.target['checked']) {
      dispatch(
        setExtraVisibleTrainOptions({
          ...visibleTrainExtraOptions,
          showPassengerFlow: true,
        })
      );
      return;
    }
    dispatch(
      setExtraVisibleTrainOptions({
          ...visibleTrainExtraOptions,
          showPassengerFlow: false,
      })
    );
    svg.attr('display-passenger-flow', TrainPassengerFlow.OFF);
  };

  const onClickLimitDisplayedTrains = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.target['checked']) {
      dispatch(
        setExtraVisibleTrainOptions({
          ...visibleTrainExtraOptions,
          limitDisplayedTrains: true,
        })
      );
      return;
    }
    dispatch(
      setExtraVisibleTrainOptions({
          ...visibleTrainExtraOptions,
          limitDisplayedTrains: false,
      })
    );
  };

  const onClickMarkInconsistencyNumberCars = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.target['checked']) {
      dispatch(
        setExtraVisibleTrainOptions({
          ...visibleTrainExtraOptions,
          markInconsistencyNumberCars: true,
        })
      );
      return;
    }
    dispatch(
      setExtraVisibleTrainOptions({
          ...visibleTrainExtraOptions,
          markInconsistencyNumberCars: false,
      })
    );
  };

  const onClickMarkOperationsUnorganized = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.target['checked']) {
      dispatch(
        setExtraVisibleTrainOptions({
          ...visibleTrainExtraOptions,
          markOperationsUnorganized: true,
        })
      );
      return;
    }
    dispatch(
      setExtraVisibleTrainOptions({
          ...visibleTrainExtraOptions,
          markOperationsUnorganized: false,
      })
    );
  };

  return {
    options: options.current,
    handlers: {
      onClickPassengerFlow,
      onClickLimitDisplayedTrains,
      onClickMarkInconsistencyNumberCars,
      onClickMarkOperationsUnorganized
    }
  };
};

export default useCreateExtraOptionsHandler;
