import { useRef } from 'react';
import {
  TrainDirectionOptions,
  setDirectionOptions
} from '../../../../redux/reducers/visibleTrain.reducer';
import { useDispatch } from 'react-redux';

type Props = {
  trainDirectionOptions: TrainDirectionOptions;
};

/**
 * Hook to control Direction form
 * And create handler for checkboxes
 */
const useCreateDirectionHandler = ({ trainDirectionOptions }: Props) => {
  const options = useRef(trainDirectionOptions);
  options.current = trainDirectionOptions;

  const dispatch = useDispatch();

  const onClickOptionUp = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.target['checked']) {
      dispatch(
        setDirectionOptions({
          all: options.current.down ? true : false,
          up: true,
          down: options.current.down
        })
      );
      return;
    }
    dispatch(setDirectionOptions({ all: false, up: false, down: options.current.down }));
  };

  const onClickOptionDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.target['checked']) {
      dispatch(
        setDirectionOptions({
          all: options.current.up ? true : false,
          up: options.current.up,
          down: true
        })
      );
      return;
    }
    dispatch(setDirectionOptions({ all: false, up: options.current.up, down: false }));
  };

  const onClickOptionAll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.target['checked']) {
      dispatch(setDirectionOptions({ all: true, up: true, down: true }));
      return;
    }
    dispatch(setDirectionOptions({ all: false, up: false, down: false }));
  };

  return {
    options: options.current,
    handlers: {
      onClickOptionAll,
      onClickOptionUp,
      onClickOptionDown
    }
  };
};

export default useCreateDirectionHandler;
