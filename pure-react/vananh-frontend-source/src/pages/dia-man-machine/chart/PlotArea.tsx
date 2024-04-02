import * as d3 from 'd3';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/config-store';
import { TimetableDataSource, TrainDatasource } from '../../../redux/reducers/timetable.reducer';
import { parseDateTime } from './Chart';
import TrainSource from './TrainSource';
import { Station, Train } from './types';

type Props = {
  mode: string;
  svgRef: React.RefObject<SVGSVGElement>;
  trains: TrainDatasource;
  stations: Station[];
  zoomTransform: d3.ZoomTransform;
  selectedTrainHandler;
  selectedTrainList: Train[];
  selectedTrainNo: number;
  timetableData: TimetableDataSource;
};

const PlotArea = ({
  mode,
  svgRef,
  trains,
  stations,
  zoomTransform,
  selectedTrainHandler,
  selectedTrainList,
  selectedTrainNo,
  timetableData
}: Props) => {
  const { dimension } = useSelector((state: RootState) => state.timetableDimensionReducer);
  const { time } = useSelector((state: RootState) => state.timetableReducer);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const highlightedArea = svg
      .select('#bgr-before-start-time-view')
      .style('pointer-events', 'none');

    return () => {
      highlightedArea.remove();
    };
  }, []);

  useEffect(() => {
    const startTime = parseDateTime(
      `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}:00`
    );
    const xStartCoor = timetable.x(parseDateTime('00:00:00'));
    // Highlight area
    const svg = d3.select(svgRef.current);
    svg
      .select('#bgr-before-start-time-view')
      .attr('x', xStartCoor)
      .attr('y', 0)
      .attr('width', timetable.x(startTime) - xStartCoor) // calculate width from start time of the x-axis
      .attr('height', dimension.height);
  }, [zoomTransform, dimension]);

  return (
    <>
      {/* The order of the drawing layers should be, from top to bottom, predicted, result, and plan. */}
      <g className="planned-trains-container" data-type="planned">
        <TrainSource
          mode={mode}
          svgRef={svgRef}
          stations={stations}
          trains={trains.plannedTrainRuns}
          zoomTransform={zoomTransform}
          selectedTrainHandler={selectedTrainHandler}
          selectedTrainList={selectedTrainList}
          selectedTrainNo={selectedTrainNo}
          containerClassName="planned-trains-container"
          timetableData={timetableData}
        />
      </g>
      <g className="resulted-trains-container" data-type="resulted">
        <TrainSource
          mode={mode}
          svgRef={svgRef}
          stations={stations}
          trains={trains.resultedTrainRuns}
          zoomTransform={zoomTransform}
          selectedTrainHandler={selectedTrainHandler}
          selectedTrainList={selectedTrainList}
          selectedTrainNo={selectedTrainNo}
          containerClassName="resulted-trains-container"
          timetableData={timetableData}
        />
      </g>
      <g className="predicted-trains-container" data-type="predicted">
        <TrainSource
          mode={mode}
          svgRef={svgRef}
          stations={stations}
          trains={trains.predictedTrainRuns}
          zoomTransform={zoomTransform}
          selectedTrainHandler={selectedTrainHandler}
          selectedTrainList={selectedTrainList}
          selectedTrainNo={selectedTrainNo}
          containerClassName="predicted-trains-container"
          timetableData={timetableData}
        />
      </g>
    </>
  );
};

export default PlotArea;
