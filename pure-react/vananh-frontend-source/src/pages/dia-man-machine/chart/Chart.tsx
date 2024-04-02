import * as d3 from 'd3';
import clone from 'lodash.clonedeep';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/config-store';
import { setSourceTrains, setTrains } from '../../../redux/reducers/timetable.reducer';
import { TrafficRestrictionData } from '../traffic-restriction/TrafficRestriction';
import useZoomChart from '../zoomable/useZoomChart';
import PlotArea from './PlotArea';
import StationAxis from './StationAxis';
import TimeAxis from './TimeAxis';
import { ChartControls } from './chart-controls/controls';
import './chart.css';
import { mapTimetableData } from './services';
import './styles.scss';
import { PlatformStation, Station, Train } from './types';

export const BASE_DAY = '2000-01-01';

export const createDateTime = (time: string) => `${BASE_DAY}T${time}Z`;

export const parseDateTime = (time: string) => {
  const timeSpliter = time.split(':');
  const hour = +timeSpliter[0];
  const numCrossDay = Math.floor(hour / 24);
  if (numCrossDay === 0) {
    return new Date(createDateTime(time));
  }
  if (numCrossDay >= 5) {
    // consider train run cross more than 5 days as invalid data
    return new Date(''); // Invalid Date
  }
  // Handle cross date trainRun/cross date trains data
  const newHour = hour % 24;
  const date = new Date(
    createDateTime(
      `${newHour.toString().padStart(2, '0')}:${timeSpliter[1].padStart(2, '0')}:${timeSpliter[2]
        .slice(0, -1)
        .padStart(2, '0')}`
    )
  );
  date.setDate(date.getDate() + numCrossDay);
  return date;
};

function bindAreaCoordinate(
  selection: d3.Selection<SVGRectElement, TrafficRestrictionData, d3.BaseType, unknown>,
  stations: (Station & PlatformStation)[]
) {
  return selection
    .attr('x', (d) => {
      const {
        timeRange: { start }
      } = d;
      const numStartDayCross = Math.floor(start.hour / 24);
      const startDay = `2000-01-${(numStartDayCross + 1).toString().padStart(2, '0')}`;
      const startHour = (start.hour % 24).toString().padStart(2, '0');
      const startMinute = start.minute.toString().padStart(2, '0');
      const x1 = timetable.x(new Date(`${startDay}T${startHour}:${startMinute}:00Z`));
      return x1;
    })
    .attr('y', (d) => {
      const y1 = timetable.y(
        stations.find((s) => s.stationCode === d.stationRange.start)!.axisDistance
      );
      return y1;
    })
    .attr('width', (d) => {
      const {
        timeRange: { start, end }
      } = d;
      const numStartDayCross = Math.floor(start.hour / 24);
      const startDay = `2000-01-${(numStartDayCross + 1).toString().padStart(2, '0')}`;
      const startHour = (start.hour % 24).toString().padStart(2, '0');
      const startMinute = start.minute.toString().padStart(2, '0');

      const numEndDayCross = Math.floor(end.hour / 24);
      const endDay = `2000-01-${(numEndDayCross + 1).toString().padStart(2, '0')}`;

      const endHour = (end.hour % 24).toString().padStart(2, '0');
      const endMinute = end.minute.toString().padStart(2, '0');

      const x1 = timetable.x(new Date(`${startDay}T${startHour}:${startMinute}:00Z`));
      const x2 = timetable.x(new Date(`${endDay}T${endHour}:${endMinute}:00Z`));
      return x2 - x1;
    })
    .attr('height', (d) => {
      const y1 = timetable.y(
        stations.find((s) => s.stationCode === d.stationRange.start)!.axisDistance
      );
      const station2 = stations.find((s) => s.stationCode === d.stationRange.end);
      let y2Domain = station2!.axisDistance;
      if (station2!.isExpandedPlatform) {
        y2Domain = stations.find(
          (s) => s.stationCode === d.stationRange.end && s.isPadding
        )!.axisDistance;
      }
      const y2 = timetable.y(y2Domain);
      return y2 - y1;
    });
}

type Props = {
  svgRef: React.RefObject<SVGSVGElement>;
  timetableData: any;
  stations: (Station & PlatformStation)[];
  setStations: Dispatch<SetStateAction<(Station & PlatformStation)[]>>;
  trafficRestrictions: TrafficRestrictionData[];
  selectedTrainHandler;
  trainsRef;
  selectedTrainList: Train[];
  selectedTrainNo: number;
};

export default function Chart({
  svgRef,
  timetableData,
  stations,
  setStations,
  trafficRestrictions,
  selectedTrainHandler,
  trainsRef,
  selectedTrainList,
  selectedTrainNo
}: Props) {
  const {
    dimension: { width, height, margin }
  } = useSelector((state: RootState) => state.timetableDimensionReducer);

  const { trains } = useSelector((state: RootState) => state.trainReducer);
  const trainRef = useRef(trains); // Mutable Trains datasource
  trainRef.current = clone(trains); // Since trains from Redux not mutable. We need to make a clone of it.
  trainsRef.current = clone(trains);
  const { time } = useSelector((state: any) => state.timetableReducer);
  const { roundedScale, zoomSource } = useZoomChart({ svgRef });
  const [mode, setMode] = useState<string>('none');
  const dispatch = useDispatch();
  useEffect(() => {
    timetable.setting = { ...timetable.setting, time };
    const { stations: stationData, trains } = mapTimetableData(
      timetableData.stationSequence,
      timetableData.trainRunData.diaStationQ,
      timetableData.trainRunData.trainQ
    );
    setStations(stationData);
    dispatch(setTrains({ predictedTrainRuns: trains }));
    dispatch(setSourceTrains({ predictedTrainRuns: trains, plannedTrainRuns: clone(trains) }));
  }, [timetableData]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg
      .attr('width', width + margin.left - 100)
      .attr('height', height + margin.top + margin.bottom)
      .attr('x', 500)
      .attr('y', 500)
      .attr('transform', `translate(${margin.left + 100},${margin.top})`);

    // Add a clipPath: everything out of this area won't be drawn.
    const defs = svg.append('defs');

    defs
      .append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0);

    defs
      .append('svg:clipPath')
      .attr('id', 'clip1')
      .append('svg:rect')
      .attr('width', width + 180)
      .attr('height', height)
      .attr('x', -180)
      .attr('y', 0);

    defs
      .append('marker')
      .attr('id', 'train-stop-marker')
      .attr('orient', 'auto-start-reverse')
      .attr('markerWidth', 3)
      .attr('markerHeight', 4)
      .attr('refX', '0.1')
      .attr('refY', '2')
      .append('path')
      .attr('d', 'M0,0 V4 L2,2 Z')
      .attr('fill', 'auto');

    svg.select('.scatter').attr('clip-path', 'url(#clip)');
    svg
      .select('.zoom-area')
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', 'none');

    return () => {
      defs.remove();
    };
  }, [width, height]);

  useEffect(() => {
    const trafficRestrictionAreas = d3
      .select(svgRef.current)
      .select('.traffic-restriction-area-group')
      .selectAll('.traffic-restriction-area')
      .data(trafficRestrictions, (d: any, index) => d.id);

    trafficRestrictionAreas.join(
      (enter) =>
        enter
          .append('rect')
          .attr('class', 'traffic-restriction-area')
          .attr('traffic-restriction-disruption', (d) => {
            return d.disruption;
          })
          .call(bindAreaCoordinate, stations),
      (update) => update.call(bindAreaCoordinate as any, stations)
    );
  }, [trafficRestrictions, zoomSource.transform, stations]);

  return (
    <>
      <div id="#chart">
        <ChartControls
          scale={roundedScale}
          svgRef={svgRef}
          zoomSource={zoomSource}
          mode={mode}
          setMode={setMode}
        />

        <svg overflow="visible" ref={svgRef}>
          <rect clipPath="url(#clip)" id="bgr-before-start-time-view"></rect>
          <g
            clipPath="url(#clip)"
            className="traffic-restriction-area-group"
            style={{ pointerEvents: 'none' }}></g>
          <g className="y-axis-container">
            <StationAxis
              svgRef={svgRef}
              stations={stations}
              setStations={setStations}
              zoomTransform={zoomSource.transform}
            />
          </g>
          <g className="x-axis-container">
            <TimeAxis svgRef={svgRef} scale={1} zoomSource={zoomSource} />
          </g>
          <g className="scatter">
            <PlotArea
              mode={mode}
              svgRef={svgRef}
              stations={stations}
              trains={trainRef.current}
              zoomTransform={zoomSource.transform}
              selectedTrainHandler={selectedTrainHandler}
              selectedTrainList={selectedTrainList}
              selectedTrainNo={selectedTrainNo}
              timetableData={timetableData}
            />
          </g>
          <rect id="zoom-area" className="zoom-area" style={{ pointerEvents: 'none' }}></rect>
        </svg>
      </div>
    </>
  );
}
