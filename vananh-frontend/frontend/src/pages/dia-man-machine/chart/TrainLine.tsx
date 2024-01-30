import * as d3 from 'd3';
import React, { useEffect } from 'react';
import { isValidDate } from '../../../lib/utils/helper';
import { TimetableDataSource } from '../../../redux/reducers/timetable.reducer';
import { parseDateTime } from './Chart';
import {
  DataDrawMode,
  DataType,
  DrawableTrain,
  FrontBackDrawMode,
  PassengerConfig,
  PassengerFlow,
  PlatformStation,
  Station,
  StayActiveCode,
  TimetableDrawMode,
  TrainDirection,
  TrainLineRun,
  TrainPassOrStopCode,
  TrainPassengerFlow,
  TrainStayActiveCode,
  TrainTime
} from './types';
import { passengerConfig } from './variables';

// IMPORTANT - need update when zoom
// Can use React.useRef
const line = d3
  .line<Pick<TrainLineRun, 'axisDistance' | 'axisTime'>>()
  .x((d) => timetable.x(d.axisTime))
  .y((d) => timetable.y(d.axisDistance));
/**
 * In case of PassOrStopCode of next station is STOP(1), Train run line start from Departure Time of station to Arrival Time of next station
 * In case of PassOrStopCode of next station is PASS(0), Train run line start from Departure Time of station to Departure Time of next station
 */
const { HIGH, MEDIUM, LOW }: PassengerConfig['congestionRanges'] = passengerConfig.congestionRanges;
export const axisTrainRunTime = (
  train: TrainTime & TrainStayActiveCode & { passOrStopCode: TrainPassOrStopCode },
  stationPosition: 'START' | 'END',
  mode: DataDrawMode = DataDrawMode.SimulatedDiaDrawMode,
  forceArvOrDpt?: 'ARV' | 'DPT'
) => {
  let time = '';
  const { passOrStopCode } = train;
  switch (mode) {
    case DataDrawMode.PlannedDiaDrawMode: {
      if (forceArvOrDpt === 'ARV') {
        time = train.simulatedArvTime;
        break;
      }
      if (stationPosition === 'START' || passOrStopCode === TrainPassOrStopCode.PASS) {
        time = train.simulatedDptTime;
        break;
      }
      time = train.simulatedArvTime;
      break;
    }
    case DataDrawMode.SimulatedDiaDrawMode: {
      if (forceArvOrDpt === 'ARV') {
        time = train.simulatedArvTime;
        break;
      }
      if (stationPosition === 'START' || passOrStopCode === TrainPassOrStopCode.PASS) {
        time = train.simulatedDptTime;
        break;
      }
      time = train.simulatedArvTime;
      break;
    }
    case DataDrawMode.StayDiaDrawMode: {
      if (
        train.arvStayActiveCode === StayActiveCode.STAY &&
        train.dptStayActiveCode !== StayActiveCode.STAY
      ) {
        if (stationPosition === 'START' || passOrStopCode === TrainPassOrStopCode.PASS) {
          time = train.simulatedDptTime;
          break;
        }
        time = train.simulatedArvTime;
      } else {
        if (stationPosition === 'START' || passOrStopCode === TrainPassOrStopCode.PASS) {
          time = train.plannedDptTime;
          break;
        }
        time = train.plannedArvTime;
      }
      break;
    }
    case DataDrawMode.ActualDiaDrawMode: {
      if (forceArvOrDpt === 'ARV') {
        time = train.resultedArvTime;
        break;
      }
      if (stationPosition === 'START' || passOrStopCode === TrainPassOrStopCode.PASS) {
        time = train.resultedDptTime;
        break;
      }
      time = train.resultedArvTime;
      break;
    }
    default:
      if (forceArvOrDpt === 'ARV') {
        time = train.plannedArvTime;
        break;
      }
      if (stationPosition === 'START' || passOrStopCode === TrainPassOrStopCode.PASS) {
        time = train.plannedDptTime;
        break;
      }
      time = train.plannedArvTime;
      break;
  }
  const date = parseDateTime(time);
  return date;
};

export const axisTrainStopTime = (
  train: TrainTime & TrainStayActiveCode,
  stationPosition: 'START' | 'END',
  mode: DataDrawMode = DataDrawMode.SimulatedDiaDrawMode
) => {
  let time = '';
  switch (mode) {
    case DataDrawMode.SimulatedDiaDrawMode: {
      time = stationPosition === 'START' ? train.simulatedArvTime : train.simulatedDptTime;
      break;
    }
    case DataDrawMode.PlannedDiaDrawMode: {
      time = stationPosition === 'START' ? train.simulatedArvTime : train.simulatedDptTime;
      break;
    }
  }
  const date = parseDateTime(time);
  return date;
};

export const axisTrainTransitTime = (
  train: TrainTime,
  arvOrDpt: 'ARV' | 'DPT',
  mode: DataDrawMode = DataDrawMode.SimulatedDiaDrawMode
) => {
  let time = '';
  switch (mode) {
    case DataDrawMode.SimulatedDiaDrawMode: {
      time = arvOrDpt === 'DPT' ? train.simulatedDptTime : train.simulatedArvTime;
      break;
    }
    case DataDrawMode.PlannedDiaDrawMode: {
      time = arvOrDpt === 'DPT' ? train.simulatedDptTime : train.simulatedArvTime;
      break;
    }
  }
  const date = parseDateTime(time);
  return date;
};

export const axisTrainLinkTime = (
  train: TrainTime,
  arvOrDpt: 'ARV' | 'DPT',
  mode: DataDrawMode = DataDrawMode.SimulatedDiaDrawMode
) => {
  let time = '';
  switch (mode) {
    case DataDrawMode.SimulatedDiaDrawMode: {
      time = arvOrDpt === 'DPT' ? train.simulatedDptTime : train.simulatedArvTime;
      break;
    }
    case DataDrawMode.PlannedDiaDrawMode: {
      time = arvOrDpt === 'DPT' ? train.simulatedDptTime : train.simulatedArvTime;
      break;
    }
  }
  const date = parseDateTime(time);
  return date;
};

function checkCoordinate(d) {
  if (d && d !== undefined && d !== null && d !== '0') {
    const matches = d.match(/M(-?[\d.]+),(-?[\d.]+)L(-?[\d.]+),(-?[\d.]+)/);

    const x1 = parseFloat(matches[1]);
    const y1 = parseFloat(matches[2]);

    const yDomain = timetable.y.domain();
    const xDomain = timetable.x.domain();

    const topLeft = [0, timetable.y(yDomain[1])];
    const bottomRight = [timetable.x(xDomain[1]), timetable.y(yDomain[0])];

    if (x1 > topLeft[0] && x1 < bottomRight[0] && y1 > topLeft[1] && y1 < bottomRight[1]) {
      return true;
    }
    return false;
  }
  return false;
}

function getIdFromPathD(container, train, id) {
  const paths = container.select('#' + id).selectAll('path.train-line.train-line-run')._groups[0];
  for (let i = 0; i < paths.length; i++) {
    const dAttribute = d3.select(paths[i]).attr('d');

    if (dAttribute) {
      if (checkCoordinate(dAttribute)) {
        return `#train-${train.trainNo}-${train.trainRunList[i].stationCode}`;
      }
      continue;
    }
  }
  return null;
}

function generatePath(
  currentPoint: Pick<TrainLineRun, 'axisDistance' | 'axisTime'>,
  nextPoint: Pick<TrainLineRun, 'axisDistance' | 'axisTime'>
) {
  if (
    !isValidDate(currentPoint.axisTime) ||
    !currentPoint.axisDistance ||
    !isValidDate(nextPoint.axisTime) ||
    !nextPoint.axisDistance
  ) {
    return '';
  }

  return line([currentPoint, nextPoint]);
}

function generateRunLine(train: DrawableTrain, stations, d: TrainLineRun, index) {
  const mode = Number(this.getAttribute('data-draw-mode')) as DataDrawMode;
  const currentPoint = {
    ...d,
    axisDistance: stations.find((s) => s.stationCode === d.stationCode)?.axisDistance,
    axisTime: axisTrainRunTime(d, 'START', mode)
  };

  const nextPoint = train.drawableTrainRunList[index + 1];
  if (!nextPoint) {
    return '';
  }

  nextPoint.axisDistance = stations.find((s) => s.stationCode === nextPoint?.stationCode)
    ?.axisDistance;

  if (d.upDownCode === TrainDirection.DOWN) {
    const paddingStation = stations.find((s) => s.stationCode === d.stationCode && s.isPadding);
    if (paddingStation?.isExpandedPlatform) {
      currentPoint.axisDistance = paddingStation.axisDistance;
    }
  } else {
    const nextStation = stations.find((s) => s.stationCode === d.stationCode - 1 && s.isPadding);
    if (nextStation?.isExpandedPlatform) {
      const currentStation = stations.find((s) => s.stationCode === d.stationCode);
      currentPoint.axisDistance = currentStation?.axisDistance;
      nextPoint.axisDistance = nextStation?.axisDistance;
      nextPoint.axisTime = axisTrainRunTime(
        train.drawableTrainRunList[index + 1],
        'END',
        mode,
        'ARV'
      );
    }
  }

  nextPoint.axisTime = axisTrainRunTime(nextPoint, 'END', mode);

  // Handle when nextStation time is cross day.
  if (nextPoint.axisTime && nextPoint.axisTime < currentPoint.axisTime) {
    nextPoint.axisTime.setDate(nextPoint.axisTime.getDate() + 1);
  }

  return generatePath(currentPoint, nextPoint);
}

function shouldDrawStopLine(d: TrainLineRun) {
  return d.passOrStopCode === 1 && d.runSequence !== 0;
}

function generateStopLine(stations, d) {
  if (
    d.stayActiveCode === StayActiveCode.STAY &&
    (d.arvStayActiveCode === StayActiveCode.ACTIVE || d.dptStayActiveCode === StayActiveCode.ACTIVE)
  ) {
    return '';
  }
  const mode = Number(this.getAttribute('data-draw-mode')) as DataDrawMode;

  const currentPoint = { ...d, axisTime: axisTrainStopTime(d, 'START', mode) };
  const nextPoint = { ...d, axisTime: axisTrainStopTime(d, 'END', mode) };

  // Handle when nextStation time is cross day.
  if (nextPoint.axisTime && nextPoint.axisTime < currentPoint.axisTime) {
    nextPoint.axisTime.setDate(nextPoint.axisTime.getDate() + 1);
  }

  const currentStation = stations.find((s) => s.stationCode === d.stationCode && !s.isPlatform);
  if (currentStation?.isExpandedPlatform) {
    const axisDistance =
      stations.find(
        (station) =>
          station.stationCode === d.stationCode && station.platformTrackCode === d.plannedTrackCode
      )?.axisDistance || 0;
    currentPoint.axisDistance = axisDistance;
    nextPoint.axisDistance = axisDistance;
  } else {
    currentPoint.axisDistance = currentStation?.axisDistance;
    nextPoint.axisDistance = currentStation?.axisDistance;
  }
  if ((nextPoint.axisTime - currentPoint.axisTime) / 1000 > 60 * 10) {
    const originalSideEndPoint = {
      axisDistance: currentPoint.axisDistance,
      axisTime: new Date(currentPoint.axisTime.getTime() + 60 * 1000 * 2)
    };

    const destinationEndPoint = {
      axisDistance: nextPoint.axisDistance,
      axisTime: new Date(nextPoint.axisTime.getTime() - 60 * 1000 * 2)
    };

    this.setAttribute('marker-end', 'url(#train-stop-marker)');
    this.setAttribute('marker-start', 'url(#train-stop-marker)');

    return `${generatePath(originalSideEndPoint, currentPoint)}${generatePath(
      nextPoint,
      destinationEndPoint
    )}`;
  }
  return generatePath(currentPoint, nextPoint);
}

function generateTransitLine(
  stations: (Station & PlatformStation)[],
  currentTrainRun: TrainLineRun,
  trainBeginSequence: number
) {
  const mode = Number(this.getAttribute('data-draw-mode')) as DataDrawMode;
  const currentStationArvTimeAxis = axisTrainTransitTime(currentTrainRun, 'ARV', mode);
  const currentStationDptTimeAxis = axisTrainTransitTime(currentTrainRun, 'DPT', mode);

  // Find the current station based on station code
  const currentStation = stations.find((s) => s.stationCode === currentTrainRun.stationCode);
  if (!currentStation) {
    return '';
  }

  const currentPoint = {
    ...currentTrainRun,
    axisTime: currentStationArvTimeAxis
  };
  currentPoint.axisDistance = currentStation.axisDistance;

  const nextPoint = {
    ...currentTrainRun,
    axisTime: currentStationArvTimeAxis
  };
  const platformStation = stations.find(
    (s) =>
      s.stationCode === currentTrainRun.stationCode &&
      s.platformTrackCode === currentTrainRun.plannedTrackCode
  );
  nextPoint.axisDistance = platformStation ? platformStation.axisDistance : 0;

  if (currentTrainRun['runSequence'] === 0 || currentTrainRun['passOrStopCode'] === 0) {
    currentPoint.axisTime = currentStationDptTimeAxis;
    nextPoint.axisTime = currentStationDptTimeAxis;
  }

  const paddingStation = stations.find(
    (s) => s.stationCode === currentTrainRun.stationCode && s.isPadding
  );
  if (!paddingStation) {
    throw new Error('Padding Station not found');
  }
  const basePoint2 = {
    ...currentTrainRun,
    axisTime: currentStationDptTimeAxis
  };
  if (currentTrainRun.upDownCode === TrainDirection.UP) {
    currentPoint.axisTime = currentStationDptTimeAxis;
    nextPoint.axisTime = currentStationDptTimeAxis;
    if (currentTrainRun.passOrStopCode === TrainPassOrStopCode.STOP) {
      basePoint2.axisTime = currentStationArvTimeAxis;
    } else {
      basePoint2.axisTime = currentStationDptTimeAxis;
    }
  }
  const line1 = generatePath(currentPoint, nextPoint);
  const line2 = generatePath(
    {
      ...basePoint2,
      axisDistance: platformStation ? platformStation.axisDistance : 0
    },
    { ...basePoint2, axisDistance: paddingStation.axisDistance }
  );

  if (
    currentTrainRun.upDownCode === TrainDirection.DOWN &&
    currentTrainRun.runSequence === trainBeginSequence
  ) {
    return line2;
  }

  return `${line1}${line2}`;
}

function drawTrainsitLine(
  mode: string,
  stations: (Station & PlatformStation)[],
  train: DrawableTrain,
  trainLineGroup: d3.Selection<any, SVGGElement, null, undefined>,
  trainBeginSequence: number,
  trainEndSequence: number,
  dataType: DataType,
  passengerFlows: PassengerFlow[]
) {
  stations
    .filter((s) => !s.isPlatform)
    .forEach((station) => {
      // Find the current train run for the station
      const currentTrainRun = train.drawableTrainRunList.find(
        (line) => line.stationCode === station.stationCode
      );
      if (!currentTrainRun) {
        return '';
      }
      const transitLineId = `train-line-transit-${station.stationCode}`;
      const isTransitLineDrawed = !trainLineGroup.select('#' + transitLineId).empty();
      // If station EXPANDED and train-line-transit NOT drawed yet. We draw new train-line-transit
      if (station.isExpandedPlatform && !isTransitLineDrawed) {
        if (
          currentTrainRun.stayActiveCode === StayActiveCode.STAY &&
          (currentTrainRun.arvStayActiveCode === StayActiveCode.ACTIVE ||
            currentTrainRun.dptStayActiveCode === StayActiveCode.ACTIVE)
        ) {
          drawCanceledTrainsitLine(
            currentTrainRun,
            trainLineGroup,
            dataType,
            transitLineId,
            stations,
            trainBeginSequence,
            passengerFlows
          );
        } else {
          trainLineGroup
            .append('path')
            .datum(currentTrainRun)
            .call(bindDrawMode as any, dataType)
            .attr('id', transitLineId)
            .attr('train-stay-active-code', currentTrainRun.stayActiveCode.toString())
            .attr('d', function (d) {
              return generateTransitLine.bind(this, stations, d, trainBeginSequence)();
            })
            .attr('class', 'train-line train-line-transit')
            .attr('train-delay-time', function (d) {
              const attr = getSimulatedDelayAttribute(d, trainBeginSequence, 'TRANSIT');
              return attr;
            })
            .call(formatLineBeforeBeginTime as any)
            .call(bindTrainCongrestion as any, passengerFlows)
            .filter((d) => [trainBeginSequence, trainEndSequence].includes(d.runSequence)) //Draw train marker if it does not have link train
            .call(addTrainRunMarker, train, trainBeginSequence, trainEndSequence);
          // Draw hit area for train-line-transit
          if (mode === 'none') {
            trainLineGroup
              .select(`#${transitLineId}`)
              .clone()
              .attr('marker-start', null)
              .attr('marker-end', null)
              .attr('class', 'hit-area')
              .attr('id', `${transitLineId}-hit-area`);
          }
        }
      } else if (station.isExpandedPlatform && isTransitLineDrawed) {
        // If station EXPANDED and train-line-transit already drawed. We update train-line-transit
        if (
          currentTrainRun.stayActiveCode === StayActiveCode.STAY &&
          (currentTrainRun.arvStayActiveCode === StayActiveCode.ACTIVE ||
            currentTrainRun.dptStayActiveCode === StayActiveCode.ACTIVE)
        ) {
          const transitLines = trainLineGroup.selectAll<d3.BaseType, TrainLineRun>(
            '#' + transitLineId
          );
          if (transitLines.size() === 1) {
            transitLines.remove();
            drawCanceledTrainsitLine(
              currentTrainRun,
              trainLineGroup,
              dataType,
              transitLineId,
              stations,
              trainBeginSequence,
              passengerFlows
            );
          } else {
            trainLineGroup
              .selectAll<d3.BaseType, TrainLineRun>('#' + transitLineId)
              .attr('d', function (d) {
                return generateTransitLine.bind(this, stations, d, trainBeginSequence)();
              });
          }
        } else {
          const transitLines = trainLineGroup.selectAll<d3.BaseType, TrainLineRun>(
            '#' + transitLineId
          );
          if (transitLines.size() === 1) {
            transitLines
              .datum(currentTrainRun)
              .attr('train-stay-active-code', currentTrainRun.stayActiveCode.toString())
              .attr('d', function (d) {
                return generateTransitLine.bind(this, stations, d, trainBeginSequence)();
              })
              .filter((d) => [trainBeginSequence, trainEndSequence].includes(d.runSequence)) //Draw train marker if it does not have link train
              .call(addTrainRunMarker as any, train, trainBeginSequence, trainEndSequence);
            // Draw hit area for train-line-transit
            const hitArea = trainLineGroup.selectAll<d3.BaseType, TrainLineRun>(
              `#${transitLineId}-hit-area`
            );
            if (!hitArea.empty()) {
              hitArea.remove();
            }
            if (mode === 'none') {
              trainLineGroup
                .select(`#${transitLineId}`)
                .clone()
                .attr('marker-start', null)
                .attr('marker-end', null)
                .attr('class', 'hit-area')
                .attr('id', `${transitLineId}-hit-area`);
            }
          } else {
            transitLines.remove();
            trainLineGroup
              .append('path')
              .datum(currentTrainRun)
              .call(bindDrawMode as any, dataType)
              .attr('id', transitLineId)
              .attr('train-stay-active-code', currentTrainRun.stayActiveCode.toString())
              .attr('d', function (d) {
                return generateTransitLine.bind(this, stations, d, trainBeginSequence)();
              })
              .attr('class', 'train-line train-line-transit')
              .attr('train-delay-time', function (d) {
                const attr = getSimulatedDelayAttribute(d, trainBeginSequence, 'TRANSIT');
                return attr;
              })
              .call(formatLineBeforeBeginTime as any)
              .call(bindTrainCongrestion as any, passengerFlows)
              .filter((d) => [trainBeginSequence, trainEndSequence].includes(d.runSequence)) //Draw train marker if it does not have link train
              .call(addTrainRunMarker, train, trainBeginSequence, trainEndSequence);
            // Draw hit area for train-line-transit
            if (mode === 'none') {
              trainLineGroup
                .select(`#${transitLineId}`)
                .clone()
                .attr('marker-start', null)
                .attr('marker-end', null)
                .attr('class', 'hit-area')
                .attr('id', `${transitLineId}-hit-area`);
            }
          }
        }
      } else if (!station.isExpandedPlatform && isTransitLineDrawed) {
        // If station NOT EXPANDED and train-line-transit already drawed. We remove train-line-transit
        trainLineGroup.selectAll('#' + transitLineId).remove();
        trainLineGroup.selectAll(`#${transitLineId}-hit-area`).remove();
      }
    });
}

function drawCanceledTrainsitLine(
  currentTrainRun: TrainLineRun,
  trainLineGroup: d3.Selection<any, SVGGElement, null, undefined>,
  dataType: DataType,
  transitLineId: string,
  stations: (Station & PlatformStation)[],
  trainBeginSequence: number,
  passengerFlows: PassengerFlow[]
) {
  const currentTrainRunArv = {
    ...currentTrainRun,
    simulatedDptTime: '4660:20:15'
  };
  trainLineGroup
    .append('path')
    .datum(currentTrainRunArv)
    .call(bindDrawMode as any, dataType)
    .attr('id', transitLineId)
    .attr('train-stay-active-code', (d) =>
      d.arvStayActiveCode === StayActiveCode.STAY
        ? StayActiveCode.STAY.toString()
        : StayActiveCode.ACTIVE.toString()
    )
    .attr('d', function (d) {
      return generateTransitLine.bind(this, stations, d, trainBeginSequence)();
    })
    .attr('class', 'train-line train-line-transit')
    .attr('train-delay-time', function (d) {
      const attr = getSimulatedDelayAttribute(d, trainBeginSequence, 'TRANSIT');
      return attr;
    })
    .call(formatLineBeforeBeginTime as any)
    .call(bindTrainCongrestion as any, passengerFlows);
  // .filter(
  //   (d) =>
  //     [trainBeginSequence, trainEndSequence].includes(d.runSequence) &&
  //     d.linkTrainPoint < 0
  // ) //Draw train marker if it does not have link train
  // .call(addTrainRunMarker, train, trainBeginSequence, trainEndSequence);

  const currentTrainRunDpt = {
    ...currentTrainRun,
    simulatedArvTime: '4660:20:15'
  };
  trainLineGroup
    .append('path')
    .datum(currentTrainRunDpt)
    .call(bindDrawMode as any, dataType)
    .attr('id', transitLineId)
    .attr('train-stay-active-code', (d) =>
      d.dptStayActiveCode === StayActiveCode.STAY
        ? StayActiveCode.STAY.toString()
        : StayActiveCode.ACTIVE.toString()
    )
    .attr('d', function (d) {
      return generateTransitLine.bind(this, stations, d, currentTrainRunDpt.stationCode)();
    })
    .attr('class', 'train-line train-line-transit')
    .attr('train-delay-time', function (d) {
      const attr = getSimulatedDelayAttribute(d, trainBeginSequence, 'TRANSIT');
      return attr;
    })
    .call(formatLineBeforeBeginTime as any)
    .call(bindTrainCongrestion as any, passengerFlows);
  // .filter(
  //   (d) =>
  //     [trainBeginSequence, trainEndSequence].includes(d.runSequence) &&
  //     d.linkTrainPoint < 0
  // ) //Draw train marker if it does not have link train
  // .call(addTrainRunMarker, train, trainBeginSequence, trainEndSequence);
}

function generateLinkLine(
  d: TrainLineRun,
  stations: (Station | PlatformStation)[],
  trains: DrawableTrain[]
) {
  const mode = Number(this.getAttribute('data-draw-mode')) as DataDrawMode;
  const backLinkTrainNo = d.backLinkTrainQ[0];

  // Find linked train
  const linkTrain = trains.find((train) =>
    train.drawableTrainRunList.find((trainRun) => trainRun.linkTrainPoint === backLinkTrainNo)
  );

  // Get link train run corresponding with current train. It should be the first(1) trainRun of the linked train
  const nextPoint = linkTrain?.drawableTrainRunList[0];
  if (!nextPoint) {
    return '';
  }
  const currentPoint = { ...d };

  const arrivedTrack = stations.find(
    (station): station is PlatformStation =>
      station.stationCode === d.stationCode &&
      'isPlatform' in station &&
      station.platformTrackCode === d.plannedTrackCode
  );

  if (arrivedTrack?.isExpandedPlatform) {
    // If station was expanded. link-line will place on the track
    currentPoint.axisDistance = arrivedTrack.axisDistance;
  } else {
    // If station was NOT expanded. link-line will place on the (main) station
    const arrivedStation = stations.find(
      (station): station is Station =>
        station.stationCode === d.stationCode && !('isPlatform' in station)
    );
    if (!arrivedStation) {
      throw new Error('arrived station not found!');
    }
    currentPoint.axisDistance = arrivedStation.axisDistance;
  }

  currentPoint.axisTime = axisTrainLinkTime(d, 'ARV', mode);
  nextPoint.axisTime = axisTrainLinkTime(nextPoint, 'DPT', mode);
  nextPoint.axisDistance = currentPoint?.axisDistance; // y-coor of current point and next point will be the same

  if ((nextPoint.axisTime.getTime() - currentPoint.axisTime.getTime()) / 1000 > 60 * 60) {
    const originalSideEndPoint = {
      axisDistance: currentPoint.axisDistance,
      axisTime: new Date(currentPoint.axisTime.getTime() + 60 * 1000 * 5)
    };

    const destinationEndPoint = {
      axisDistance: nextPoint.axisDistance,
      axisTime: new Date(nextPoint.axisTime.getTime() - 60 * 1000 * 5)
    };

    this.setAttribute('marker-end', 'url(#train-stop-marker)');
    this.setAttribute('marker-start', 'url(#train-stop-marker)');

    return `${generatePath(originalSideEndPoint, currentPoint)}${generatePath(
      nextPoint,
      destinationEndPoint
    )}`;
  }
  return generatePath(currentPoint, nextPoint);
}

function updateStayActiveCodeRunLine(d: TrainLineRun): string {
  if (d.stayActiveCode === StayActiveCode.STAY && d.dptStayActiveCode === StayActiveCode.STAY) {
    return StayActiveCode.STAY.toString();
  } else {
    return StayActiveCode.ACTIVE.toString();
  }
}

function updateStayActiveCodeStopLine(train: DrawableTrain, d: TrainLineRun): string {
  const currentTrainRun = train.drawableTrainRunList.find(
    (trainRun) => trainRun.stationCode === d.stationCode
  );
  if (
    currentTrainRun?.stayActiveCode === StayActiveCode.STAY &&
    currentTrainRun?.dptStayActiveCode === StayActiveCode.STAY
  ) {
    return StayActiveCode.STAY.toString();
  } else {
    return StayActiveCode.ACTIVE.toString();
  }
}

function updateLines(
  mode: string,
  container: d3.Selection<d3.BaseType, SVGGElement, any, any>,
  train: DrawableTrain,
  stations: (Station & PlatformStation)[],
  trains: DrawableTrain[],
  passengerFlows: PassengerFlow[]
) {
  const trainLineGroup = container.select(`#train-no-${train.trainNo}`);
  if (!train['render']) {
    return trainLineGroup.remove();
  }
  const dataType = container.attr('data-type') as DataType;
  const trainBeginSequence = +trainLineGroup.attr('train-begin-sequence');
  const trainEndSequence = +trainLineGroup.attr('train-end-sequence');

  train.drawableTrainRunList.forEach((trainRun) => {
    if (trainRun.linkTrainPoint >= 0 && trainRun.stayActiveCode === StayActiveCode.ACTIVE) {
      // Cancel marker start
      if (trainRun.runSequence === trainBeginSequence && trainRun.frontLinkTrainQ[0] === -1) {
        const axisTime = parseDateTime(trainRun.simulatedDptTime);
        let axisDistance = trainRun.axisDistance;
        const track = stations.find(
          (station): station is PlatformStation =>
            station.stationCode === trainRun.stationCode &&
            'isPlatform' in station &&
            station.platformTrackCode === trainRun.plannedTrackCode
        );
        if (track?.isExpandedPlatform) {
          // If station was expanded. link-line will place on the track
          axisDistance = track.axisDistance;
        } else {
          // If station was NOT expanded. link-line will place on the (main) station
          const station = stations.find(
            (station) => station.stationCode === trainRun.stationCode && !('isPlatform' in station)
          );
          if (!station) {
            throw new Error('arrived station not found!');
          }
          axisDistance = station.axisDistance;
        }
        const cancelMarker = trainLineGroup.select(
          `#cancel-marker-${train.trainNo}-${trainRun.stationCode}`
        );
        if (cancelMarker.empty()) {
          trainLineGroup
            .append('circle')
            .attr('id', `cancel-marker-${train.trainNo}-${trainRun.stationCode}`)
            .attr('cx', timetable.x(axisTime))
            .attr('cy', timetable.y(axisDistance))
            .attr('r', 5)
            .attr('fill', 'blue')
            .attr('stroke', 'blue');
        } else {
          cancelMarker.attr('cx', timetable.x(axisTime)).attr('cy', timetable.y(axisDistance));
        }
      } else if (trainRun.runSequence === trainEndSequence && trainRun.backLinkTrainQ[0] === -1) {
        // Cancel marker end
        const axisTime = parseDateTime(trainRun.simulatedArvTime);
        let axisDistance = trainRun.axisDistance;
        const track = stations.find(
          (station): station is PlatformStation =>
            station.stationCode === trainRun.stationCode &&
            'isPlatform' in station &&
            station.platformTrackCode === trainRun.plannedTrackCode
        );
        if (track?.isExpandedPlatform) {
          // If station was expanded. link-line will place on the track
          axisDistance = track.axisDistance;
        } else {
          // If station was NOT expanded. link-line will place on the (main) station
          const station = stations.find(
            (station) => station.stationCode === trainRun.stationCode && !('isPlatform' in station)
          );
          if (!station) {
            throw new Error('arrived station not found!');
          }
          axisDistance = station.axisDistance;
        }
        const cancelMarker = trainLineGroup.select(
          `#cancel-marker-${train.trainNo}-${trainRun.stationCode}`
        );
        if (cancelMarker.empty()) {
          trainLineGroup
            .append('circle')
            .attr('id', `cancel-marker-${train.trainNo}-${trainRun.stationCode}`)
            .attr('cx', timetable.x(axisTime))
            .attr('cy', timetable.y(axisDistance))
            .attr('r', 5)
            .attr('fill', 'blue')
            .attr('stroke', 'blue');
        } else {
          cancelMarker.attr('cx', timetable.x(axisTime)).attr('cy', timetable.y(axisDistance));
        }
      } else {
        const cancelMarker = trainLineGroup.select(
          `#cancel-marker-${train.trainNo}-${trainRun.stationCode}`
        );
        if (!cancelMarker.empty()) cancelMarker.remove();
      }
    }
  });

  trainLineGroup
    .selectAll<d3.BaseType, TrainLineRun>('.train-line-run')
    .datum((d, index) => train.drawableTrainRunList[index])
    .attr('train-stay-active-code', (d) => updateStayActiveCodeRunLine(d))
    .attr('d', function (d, index) {
      return generateRunLine.bind(this, train, stations, d, index)();
    });
  trainLineGroup
    .selectAll<d3.BaseType, TrainLineRun>('.train-line-stop')
    .datum((d) =>
      train.drawableTrainRunList.find((trainRun) => trainRun.stationCode === d.stationCode)
    )
    .filter((d) => shouldDrawStopLine(d!))
    .attr('train-stay-active-code', (d) => updateStayActiveCodeStopLine(train, d!))
    .attr('d', function (d) {
      return generateStopLine.bind(this, stations, d)();
    });
  trainLineGroup
    .selectAll<d3.BaseType, TrainLineRun>('.train-line-link')
    .datum((d) =>
      train.drawableTrainRunList.find((trainRun) => trainRun.stationCode === d.stationCode)
    )
    .attr('d', function (d) {
      if (d === undefined || d.linkTrainPoint < 0 || d.backLinkTrainQ[0] < 0) return '';
      return generateLinkLine.bind(this, d, stations, trains)();
    })
    .attr('train-link-to', bindTrainLinkNo(trains) as any)
    .call(formatLineBeforeBeginTime as any, trains);

  if (mode === 'none') {
    const hitArea = trainLineGroup.selectAll('.hit-area');
    if (hitArea.empty()) {
      const drawer = trainLineGroup.selectAll('.hit-area').data(train.drawableTrainRunList);
      // Draw hit area for train line
      drawHitAreas(drawer, passengerFlows, dataType, train, stations, trains);
    } else {
      trainLineGroup
        .selectAll<d3.BaseType, TrainLineRun>('.line-run')
        .attr('d', function (d, index) {
          return generateRunLine.bind(this, train, stations, d, index)();
        });
      trainLineGroup.selectAll<d3.BaseType, TrainLineRun>('.line-stop').attr('d', function (d) {
        return generateStopLine.bind(this, stations, d)();
      });
      trainLineGroup
        .selectAll<d3.BaseType, TrainLineRun>('.line-link')
        .datum((d) =>
          train.drawableTrainRunList.find((trainRun) => trainRun.stationCode === d.stationCode)
        )
        .attr('d', function (d) {
          if (d === undefined || d.linkTrainPoint < 0 || d.backLinkTrainQ[0] < 0) return '';
          return generateLinkLine.bind(this, d, stations, trains)();
        });
    }
  } else {
    const hitArea = trainLineGroup.selectAll('.hit-area');
    if (!hitArea.empty()) hitArea.remove();
  }

  trainLineGroup
    .selectAll('.train-name-label textPath')
    .attr('xlink:href', getIdFromPathD(container, train, `train-no-${train.trainNo}`));

  // Draw train transit line
  drawTrainsitLine(
    mode,
    stations,
    train,
    trainLineGroup,
    trainBeginSequence,
    trainEndSequence,
    dataType,
    passengerFlows
  );

  return trainLineGroup;
}

function addTrainRunMarker(
  selection: d3.Selection<SVGPathElement, TrainLineRun, null, undefined>,
  train: DrawableTrain,
  trainBeginSequence: number,
  trainEndSequence: number
) {
  return (
    selection
      // train start marker
      .attr('marker-start', function (d) {
        /**
         * In case train is running DOWN: If any trainRun run before this, then we will not draw marker
         * In case train is running UP: If any trainRun run after this, then we will not draw marker
         */
        const isOtherTrainRunExist =
          (d.upDownCode === TrainDirection.DOWN &&
            train.trainRunList.some((t) => t.runSequence < trainBeginSequence)) ||
          (d.upDownCode === TrainDirection.UP &&
            train.trainRunList.some((t) => t.runSequence > trainEndSequence));
        if (isOtherTrainRunExist) {
          return null;
        }

        const isTrainRunFromFirstDrawableStation =
          (d.upDownCode === TrainDirection.DOWN &&
            d.runSequence === trainBeginSequence &&
            (d.frontLinkTrainQ[0] === undefined || d.frontLinkTrainQ[0] === -1)) ||
          (d.upDownCode === TrainDirection.UP &&
            d.runSequence === trainEndSequence &&
            (d.backLinkTrainQ[0] === undefined || d.backLinkTrainQ[0] === -1));
        if (isTrainRunFromFirstDrawableStation) {
          // Draw marker at the begin
          const trainNo = this.parentElement?.getAttribute('train-train-no');
          return `url(#train-marker-${trainNo})`;
        }
        return null;
      })
      // train end marker
      .attr('marker-end', function (d) {
        const isOtherTrainRunExist =
          (d.upDownCode === TrainDirection.DOWN &&
            train.trainRunList.some((t) => t.runSequence > trainEndSequence)) ||
          (d.upDownCode === TrainDirection.UP &&
            train.trainRunList.some((t) => t.runSequence < trainBeginSequence));
        if (isOtherTrainRunExist) {
          // If this is not the end station of the train, we not draw marker
          return null;
        }
        const isTrainRunFromFirstDrawableStation =
          (d.upDownCode === TrainDirection.DOWN &&
            d.runSequence === trainEndSequence &&
            (d.backLinkTrainQ[0] === undefined || d.backLinkTrainQ[0] === -1)) ||
          (d.upDownCode === TrainDirection.UP &&
            d.runSequence === trainBeginSequence &&
            (d.frontLinkTrainQ[0] === undefined || d.frontLinkTrainQ[0] === -1));
        if (isTrainRunFromFirstDrawableStation) {
          // Draw marker at the end
          const trainNo = this.parentElement?.getAttribute('train-train-no');
          return `url(#train-marker-${trainNo})`;
        }
        return null;
      })
  );
}

/**
 * If (Drawing mode is SimulatedDiaDrawMode) AND (PlanedArvTime < begin time on Setting page)
 */
function formatLineBeforeBeginTime(
  selection: d3.Selection<SVGPathElement, TrainLineRun, SVGGElement, unknown>,
  trains?: DrawableTrain[]
) {
  return selection.attr('train-arv-before-begin-time', function (d, i, nodes) {
    let trainRun = d;
    if (this.classList.contains('train-line-run')) {
      const nextTrainRunNode = d3.select<SVGPathElement, TrainLineRun>(nodes[i + 1]);
      if (!nextTrainRunNode.empty()) {
        trainRun = nextTrainRunNode.datum();
      }
    }
    /**
     * If line is link line. we calculate using time of first train run of link train.
     */
    if (this.classList.contains('train-line-link')) {
      const linkTrainTo = this.getAttribute('train-link-to');
      if (!linkTrainTo) {
        return -1;
      }
      const linkTrain = trains?.find((t) => t.trainNo === +linkTrainTo);
      if (!linkTrain) {
        return -1;
      }
      trainRun = linkTrain.drawableTrainRunList[0];
    }
    const { hour, minute } = timetable.setting.time;
    const beginTime = parseDateTime(
      `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`
    );
    let date = parseDateTime(trainRun.plannedArvTime);

    if (!isValidDate(date) || this.classList.contains('train-line-stop')) {
      date = parseDateTime(trainRun.plannedDptTime);
    }
    if (date && beginTime && date < beginTime) {
      return 1;
    }
    return 0;
  });
}

function bindTrainLinkNo(
  trains: DrawableTrain[]
):
  | string
  | number
  | boolean
  | readonly (string | number)[]
  | d3.ValueFn<
      SVGPathElement,
      TrainLineRun,
      string | number | boolean | readonly (string | number)[] | null
    >
  | null {
  return (d) => {
    const backLinkTrainNo = d.backLinkTrainQ[0];
    const linkTrain = trains.find((train) =>
      train.drawableTrainRunList.find((trainRun) => trainRun.linkTrainPoint === backLinkTrainNo)
    );
    if (!linkTrain) {
      return -1;
    }
    return linkTrain.trainNo;
  };
}

function bindDrawMode(
  selection: d3.Selection<SVGPathElement, TrainLineRun, SVGGElement | d3.BaseType, SVGGElement>,
  dataType: DataType
) {
  if (selection.empty()) {
    return selection;
  }
  const datum = selection.datum();

  const drawMode: TimetableDrawMode = {
    dataDrawMode: DataDrawMode.SimulatedDiaDrawMode,
    frontBackDrawMode: FrontBackDrawMode.PLANNED_SERVICE_SUSPENTION
  };

  switch (dataType) {
    case DataType.PREDICTED:
      if (
        datum.arvStayActiveCode === StayActiveCode.ACTIVE ||
        datum.stayActiveCode === StayActiveCode.STAY
      ) {
        drawMode['dataDrawMode'] = DataDrawMode.SimulatedDiaDrawMode;
        drawMode['frontBackMode'] = FrontBackDrawMode.FRONT;
      } else {
        drawMode['dataDrawMode'] = DataDrawMode.StayDiaDrawMode;
        drawMode['frontBackMode'] = FrontBackDrawMode.NORMALLY_SUSPENTION;
      }
      break;
    case DataType.PLANNED:
      if (datum.arvStayActiveCode === StayActiveCode.ACTIVE) {
        drawMode['dataDrawMode'] = DataDrawMode.PlannedDiaDrawMode;
        drawMode['frontBackMode'] = FrontBackDrawMode.FRONT;
      } else {
        drawMode['dataDrawMode'] = DataDrawMode.StayDiaDrawMode;
        drawMode['frontBackMode'] = FrontBackDrawMode.NORMALLY_SUSPENTION;
      }
      break;
    default:
      if (datum.arvStayActiveCode === StayActiveCode.ACTIVE) {
        drawMode['dataDrawMode'] = DataDrawMode.SimulatedDiaDrawMode;
        drawMode['frontBackMode'] = FrontBackDrawMode.FRONT;
      } else {
        drawMode['dataDrawMode'] = DataDrawMode.StayDiaDrawMode;
        drawMode['frontBackMode'] = FrontBackDrawMode.PLANNED_SERVICE_SUSPENTION;
      }
      break;
  }

  return selection
    .attr('data-draw-mode', drawMode['dataDrawMode'])
    .attr('front-back-mode', drawMode['frontBackMode']);
}

function bindTrainCongrestion(
  selection: d3.Selection<SVGPathElement, TrainLineRun, SVGGElement | d3.BaseType, SVGGElement>,
  passengerFlows: PassengerFlow[]
) {
  return selection.attr('class', function (d) {
    if(Number(selection.attr('train-arv-before-begin-time')) === 0) {
      const congestionPercentage =
      passengerFlows.find((p) => p.stationCode === d.stationCode)?.['congestionPercentage'] || 0;
      const className =
      congestionPercentage >= LOW.MIN && congestionPercentage < LOW.MAX
        ? LOW.COLOR_RANGE
        : congestionPercentage >= MEDIUM.MIN && congestionPercentage < MEDIUM.MAX
        ? MEDIUM.COLOR_RANGE
        : congestionPercentage >= HIGH.MIN
        ? HIGH.COLOR_RANGE
        : '';
      return this.classList.toString() + ' ' + className;
    }
    return this.classList.toString()
  });
}

function createLines(
  mode: string,
  container: d3.Selection<d3.BaseType, SVGGElement, null, undefined>,
  svgRef: React.RefObject<SVGSVGElement>,
  train: DrawableTrain,
  stations: (Station & PlatformStation)[],
  trains: DrawableTrain[],
  selectedTrainHandler,
  selectedTrainNo: number,
  passengerFlows: PassengerFlow[]
) {
  const runSequenceStartPoint = Math.min(...train.drawableTrainRunList.map((t) => t.runSequence));
  const runSequenceEndPoint = Math.max(...train.drawableTrainRunList.map((t) => t.runSequence));
  const dataType = container.attr('data-type') as DataType;

  const trainLineGroup = container
    .append('g')
    .attr('class', 'train-line-group')
    .attr('train-train-no', train.trainNo)
    .attr('train-charge-flag', () => {
      return train.chargeFlag;
    })
    .attr('id', `train-no-${train.trainNo}`)
    .attr('train-begin-sequence', runSequenceStartPoint)
    .attr('train-end-sequence', runSequenceEndPoint)
    .attr('display-passenger-flow', TrainPassengerFlow.OFF);

  if (train.trainNo === selectedTrainNo) {
    trainLineGroup.classed('train-selected', true);
  }

  const drawer = trainLineGroup.selectAll('.train-line').data(train.drawableTrainRunList);

  // Draw train run line
  drawer
    .enter()
    .append('path')
    .attr('class', 'train-line train-line-run')
    .call(bindDrawMode, dataType)
    .attr('train-stay-active-code', (d) => d.stayActiveCode)
    .attr('train-delay-time', function (d, i) {
      const attr = getSimulatedDelayAttribute(
        train.drawableTrainRunList[i + 1],
        runSequenceStartPoint,
        false
      );
      return attr;
    })
    .attr('d', function (d, index) {
      return generateRunLine.bind(this, train, stations, d, index)();
    })
    .call(formatLineBeforeBeginTime)
    .call(bindTrainCongrestion, passengerFlows)
    .attr('id', (d) => `train-${train.trainNo}-${d.stationCode}`);

  // Draw train stop line
  drawer
    .enter()
    .filter(shouldDrawStopLine)
    .append('path')
    .call(bindDrawMode, dataType)
    .attr('train-stay-active-code', (d) => d.stayActiveCode)
    .attr('d', function (d) {
      return generateStopLine.bind(this, stations, d)();
    })
    .attr('class', 'train-line train-line-stop')
    .attr('train-delay-time', function (d, i) {
      const attr = getSimulatedDelayAttribute(d, runSequenceStartPoint, 'STOP');
      return attr;
    })
    .call(formatLineBeforeBeginTime)
    .call(bindTrainCongrestion, passengerFlows)
    .attr('segment-station-code-stop', (d, i) => `train-${train.trainNo}-${d.stationCode}`);

  // Draw train link line
  drawer
    .enter()
    .filter((d) => d.linkTrainPoint >= 0 && d.backLinkTrainQ[0] >= 0)
    .append('path')
    .call(bindDrawMode, dataType)
    .attr('train-link-to', bindTrainLinkNo(trains))
    .attr('d', function (d) {
      return generateLinkLine.bind(this, d, stations, trains)();
    })
    .attr('class', 'train-line train-line-link')
    .attr('train-delay-time', function (d, i) {
      const linkTrain = Number(this.getAttribute('train-link-to'));
      const nextLinkTrainRun = trains.find((t) => t.trainNo === linkTrain)?.drawableTrainRunList[0];
      const attr = getSimulatedDelayAttribute(nextLinkTrainRun!, runSequenceStartPoint, 'LINK');
      return attr;
    })
    .call(formatLineBeforeBeginTime, trains);

  const trainBeginSequence = +trainLineGroup.attr('train-begin-sequence');
  const trainEndSequence = +trainLineGroup.attr('train-end-sequence');

  if (mode === 'none') {
    // Draw hit area for train line
    drawHitAreas(drawer, passengerFlows, dataType, train, stations, trains);
  }

  // Draw train transit line
  drawTrainsitLine(
    mode,
    stations,
    train,
    trainLineGroup,
    trainBeginSequence,
    trainEndSequence,
    dataType,
    passengerFlows
  );

  // Generate train name
  trainLineGroup
    .append('text')
    .attr('class', 'train-name-label')
    .append('textPath')
    .attr('xlink:href', getIdFromPathD(container, train, `train-no-${train.trainNo}`))
    .text(train.trainNoName)
    .attr('startOffset', '-2')
    .style('font-size', '8px');

  trainLineGroup.on('click', function (e) {
    d3.select(svgRef.current)
      .selectAll('.train-line-group.train-selected')
      .classed('train-selected', false);

    const element = d3.select(this);
    element.classed('train-selected', !element.classed('train-selected'));
    // alert(element.attr('train-train-no'));
    selectedTrainHandler(train, e);
  });

  trainLineGroup
    .append('marker')
    .attr('class', 'train-marker')
    .attr('id', `train-marker-${train.trainNo}`)
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .attr('refX', 5)
    .attr('refY', 5)
    .datum(train.drawableTrainRunList[0])
    .call(bindDrawMode as any, dataType)
    .call(formatLineBeforeBeginTime as any)
    .append('circle')
    .attr('cx', 5)
    .attr('cy', 5)
    .attr('r', 2);

  return trainLineGroup;
}

const getSimulatedDelayAttribute = (trainRun: TrainLineRun, runSequenceStartPoint, lineType) => {
  if (!trainRun) {
    return 'none';
  }
  const delayTime = calculatedDelayTime(trainRun, runSequenceStartPoint, lineType);

  switch (true) {
    case delayTime >= 15 * 60: // 15 mins
      return '15m';
    case delayTime >= 10 * 60: // 10 mins
      return '10m';
    case delayTime >= 5 * 60: // 5 mins
      return '5m';
    case delayTime >= 30:
      return '30s';
    default:
      return 'none'; // < 30s consider as no delay
  }
};

const calculatedDelayTime = (trainLine: TrainLineRun, runSequenceStartPoint, lineType) => {
  if (
    lineType === 'STOP' ||
    lineType === 'LINK' ||
    trainLine.passOrStopCode === TrainPassOrStopCode.PASS ||
    runSequenceStartPoint === trainLine.runSequence
  ) {
    return (
      (parseDateTime(trainLine.simulatedDptTime).getTime() -
        parseDateTime(trainLine.plannedDptTime).getTime()) /
      1000
    );
  }
  return (
    (parseDateTime(trainLine.simulatedArvTime).getTime() -
      parseDateTime(trainLine.plannedArvTime).getTime()) /
    1000
  );
};

const drawTrainLines = (
  mode: string,
  container: d3.Selection<d3.BaseType, SVGGElement, null, undefined>,
  svgRef: React.RefObject<SVGSVGElement>,
  train: DrawableTrain,
  stations: (Station & PlatformStation)[],
  trains: DrawableTrain[],
  selectedTrainHandler,
  selectedTrainNo: number,
  timetableData: TimetableDataSource
) => {
  train.trainRunList = train.trainRunList.sort((t) => t.runSequence);
  const trainLine = container.select(`#train-no-${train.trainNo}`);
  const passengerFlows = timetableData.passengerFlowData.filter(
    (p) => +p.trainNo === train.trainNo
  );
  if (trainLine.empty() && train['render']) {
    return createLines(
      mode,
      container,
      svgRef,
      train,
      stations,
      trains,
      selectedTrainHandler,
      selectedTrainNo,
      passengerFlows
    );
  }
  // Update train `path` if train-line already drawed
  if (!trainLine.empty()) {
    return updateLines(mode, container, train, stations, trains, passengerFlows);
  }
};

const drawHitAreas = (
  drawer: d3.Selection<d3.BaseType, TrainLineRun, SVGGElement | d3.BaseType, SVGGElement>,
  passengerFlows: PassengerFlow[],
  dataType: DataType,
  train: DrawableTrain,
  stations: (Station & PlatformStation)[],
  trains: DrawableTrain[]
) => {
  // Draw hit area for train run line
  drawer
    .enter()
    .append('path')
    .attr('class', 'hit-area line-run')
    .call(bindDrawMode, dataType)
    .attr('d', function (d, index) {
      return generateRunLine.bind(this, train, stations, d, index)();
    });

  // Draw hit area for train stop line
  drawer
    .enter()
    .filter(shouldDrawStopLine)
    .append('path')
    .attr('class', 'hit-area line-stop')
    .call(bindDrawMode, dataType)
    .attr('d', function (d) {
      return generateStopLine.bind(this, stations, d)();
    });

  // Draw hit area for train link line
  drawer
    .enter()
    .filter((d) => d.linkTrainPoint >= 0 && d.backLinkTrainQ[0] >= 0)
    .append('path')
    .attr('class', 'hit-area line-link')
    .call(bindDrawMode, dataType)
    .attr('d', function (d) {
      return generateLinkLine.bind(this, d, stations, trains)();
    });
};

type Props = {
  mode: string;
  svgRef: React.RefObject<SVGSVGElement>;
  train: DrawableTrain;
  trains: DrawableTrain[];
  stations: any[];
  selectedTrainHandler;
  selectedTrainNo: number;
  container: d3.Selection<d3.BaseType, SVGGElement, null, undefined> | null;
  timetableData: TimetableDataSource;
};

const TrainLine = ({
  mode,
  svgRef,
  train,
  stations,
  trains,
  selectedTrainHandler,
  selectedTrainNo,
  container,
  timetableData
}: Props) => {
  useEffect(() => {
    drawTrainLines(
      mode,
      container!,
      svgRef,
      train,
      stations,
      trains,
      selectedTrainHandler,
      selectedTrainNo,
      timetableData
    );
  }, [train, stations, mode]);

  return <></>;
};

export default TrainLine;
