import * as d3 from 'd3';
import { useEffect } from 'react';
import { DrawableTrain } from '../types';

type Props = {
  container: d3.Selection<d3.BaseType, SVGGElement, any, any>;
  trains: DrawableTrain[]; // possible new train lines data
  drawableTrains: DrawableTrain[]; // drawed train lines
};

/**
 * Hook to handle filter display train Direction
 */
const useHandleUpdateTrainLineDirection = ({ container, drawableTrains, trains }: Props) => {
  useEffect(() => {
    const drawedTrainLines = drawableTrains.map((t) => t.trainNo);
    const trainLines = trains.map((t) => t.trainNo);

    // Drawed Train Lines that should be removed.
    const shouldBeRemoveTrainLines = drawedTrainLines.filter((o) => trainLines.indexOf(o) === -1);

    // Train Lines that should be draw new/or update.
    // const shouldBeDrawTrainLines = trainLines.filter((o) => drawedTrainLines.indexOf(o) === -1);

    if (shouldBeRemoveTrainLines.length > 0) {
      container
        .selectAll(
          shouldBeRemoveTrainLines
            .map((t) => {
              // build train line selectors
              return `g.train-line-group#train-no-${t}`; // train line selector
            })
            .join(',')
        )
        .remove();
    }
  }, [trains.length]);
  return {};
};

export default useHandleUpdateTrainLineDirection;
