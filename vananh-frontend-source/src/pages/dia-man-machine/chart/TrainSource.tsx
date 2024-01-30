import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import TrainLine, { axisTrainRunTime } from './TrainLine';
import useHandleUpdateTrainLineDirection from './hooks/useHandleUpdateTrainLineDirection';
import { DrawableTrain, Station, Train, TrainDirection } from './types';
import { TimetableDataSource } from '../../../redux/reducers/timetable.reducer';

type Point2D = [number, number];

function getLineIntersection(p1, p2, p3, p4) {
  const s1_x = p2[0] - p1[0];
  const s1_y = p2[1] - p1[1];
  const s2_x = p4[0] - p3[0];
  const s2_y = p4[1] - p3[1];
  const s = (-s1_y * (p1[0] - p3[0]) + s1_x * (p1[1] - p3[1])) / (-s2_x * s1_y + s1_x * s2_y);
  const t = (s2_x * (p1[1] - p3[1]) - s2_y * (p1[0] - p3[0])) / (-s2_x * s1_y + s1_x * s2_y);

  return s >= 0 && s <= 1 && t >= 0 && t <= 1;
}

const COORD_PADDING = 500;

/**
 * If vector train line (head = train run end, tail = train run start)
 * cross the edges of the chart. then this train line should be draw.
 */
function shouldDrawTrainLine(
  stations: Station[],
  selectedTrainList: Train[]
): (value: DrawableTrain, index: number, array: DrawableTrain[]) => DrawableTrain {
  const yDomain = timetable.y.domain();
  const xDomain = timetable.x.domain();
  const topLeft: Point2D = [timetable.x(xDomain[0]), timetable.y(yDomain[1])];
  const topRight: Point2D = [timetable.x(xDomain[1]), timetable.y(yDomain[1])];
  const bottomLeft: Point2D = [timetable.x(xDomain[0]), timetable.y(yDomain[0])];
  const bottomRight: Point2D = [timetable.x(xDomain[1]), timetable.y(yDomain[0])];

  const axisTop: [Point2D, Point2D] = [topLeft, topRight];
  const axisRight: [Point2D, Point2D] = [topRight, bottomRight];
  const axisBottom: [Point2D, Point2D] = [bottomLeft, bottomRight];
  const axisLeft: [Point2D, Point2D] = [topLeft, bottomLeft];
  return (train) => {
    if (selectedTrainList.findIndex((s) => s.trainNo === train.trainNo) !== -1) {
      return {
        ...train,
        render: true
      };
    }
    const y1 =
      stations.find(
        (s) => train.drawableTrainRunList[0].stationCode === s.stationCode && !s['isPlatform']
      )?.axisDistance || 0;
    const from: Point2D = [
      timetable.x(axisTrainRunTime(train.drawableTrainRunList[0], 'START')),
      timetable.y(y1)
    ];
    const y2 =
      stations.find(
        (s) =>
          train.drawableTrainRunList[train.drawableTrainRunList.length - 1].stationCode ===
            s.stationCode && !s['isPlatform']
      )?.axisDistance || 0;
    const to: Point2D = [
      timetable.x(
        axisTrainRunTime(train.drawableTrainRunList[train.drawableTrainRunList.length - 1], 'END')
      ),
      timetable.y(y2)
    ];

    /**
     * Add vector train-run length to cross the edges of chart. In case train line start short journey.
     */

    // TrainDirection.UP
    const trainLine: [Point2D, Point2D] = [
      [from[0] - COORD_PADDING, from[1] + COORD_PADDING],
      [to[0] + COORD_PADDING, to[1] - COORD_PADDING]
    ];
    if (train.drawableTrainRunList[0].upDownCode === TrainDirection.DOWN) {
      trainLine[0] = [from[0] - COORD_PADDING, from[1] - COORD_PADDING];
      trainLine[1] = [to[0] + COORD_PADDING, to[1] + COORD_PADDING];
    }

    const xTop = getLineIntersection(trainLine[0], trainLine[1], axisTop[0], axisTop[1]);
    const xRight = getLineIntersection(trainLine[0], trainLine[1], axisRight[0], axisRight[1]);
    const xBottom = getLineIntersection(trainLine[0], trainLine[1], axisBottom[0], axisBottom[1]);
    const xLeft = getLineIntersection(trainLine[0], trainLine[1], axisLeft[0], axisLeft[1]);
    if (xTop || xLeft || xBottom || xRight) {
      return {
        ...train,
        render: true
      };
    }
    return {
      ...train,
      render: false
    };
  };
}

type Props = {
  mode: string;
  svgRef: React.RefObject<SVGSVGElement>;
  trains: DrawableTrain[];
  stations: Station[];
  zoomTransform: d3.ZoomTransform;
  selectedTrainHandler;
  selectedTrainList: Train[];
  selectedTrainNo: number;
  containerClassName: string;
  timetableData: TimetableDataSource;
};

const TrainSource = ({
  mode,
  svgRef,
  trains,
  stations,
  zoomTransform,
  selectedTrainHandler,
  selectedTrainList,
  selectedTrainNo,
  containerClassName,
  timetableData
}: Props) => {
  const [drawableTrains, setDrawableTrains] = useState(trains);
  const container = useRef<d3.Selection<d3.BaseType, any, null, undefined> | null>(null);
  container.current = d3.select(svgRef.current).select(`g.${containerClassName}`);

  // Update Train Lines hook
  useHandleUpdateTrainLineDirection({ container: container.current, drawableTrains, trains });

  useEffect(() => {
    setDrawableTrains(trains.map(shouldDrawTrainLine(stations, selectedTrainList)));
  }, [zoomTransform, trains, selectedTrainList]);

  return (
    <>
      {drawableTrains.map((train) => (
        <TrainLine
          mode={mode}
          svgRef={svgRef}
          train={train}
          trains={trains}
          stations={stations}
          key={train.trainNo}
          selectedTrainHandler={selectedTrainHandler}
          selectedTrainNo={selectedTrainNo}
          container={container.current}
          timetableData={timetableData}
        />
      ))}
    </>
  );
};

export default TrainSource;
