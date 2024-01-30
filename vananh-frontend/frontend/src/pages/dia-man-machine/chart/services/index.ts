import { DrawableTrain, StayActiveCode, TrainLineRun } from '../types';

export const mapTrains = (stations, trainQ) => {
  const trains: DrawableTrain[] = [];
  for (let index = 0; index < trainQ.length; index++) {
    const tQ = trainQ[index];
    const trainRunList: TrainLineRun[] = [];
    const drawableTrainRunList: TrainLineRun[] = [];
    tQ.trainRunList = tQ.trainRunList.sort((t1, t2) => t1.runSequence - t2.runSequence);
    for (let j = 0; j < tQ.trainRunList.length; j++) {
      const train = tQ.trainRunList[j];
      const station = stations.find((station) => station.stationCode === train.stationCode);
      const trainRun = {
        trainNoName: train.trainNoName,
        stationCode: train.stationCode,
        distance: station?.distance,
        plannedArvTime: train.plannedArvTime,
        plannedDptTime: train.plannedDptTime,
        plannedTrackCode: train.planedTrackCode,
        simulatedArvTime: train.operationalArvTime || train.plannedArvTime,
        simulatedDptTime: train.operationalDptTime || train.plannedDptTime,
        resultedArvTime: train.resultedArvTime,
        resultedDptTime: train.resultedDptTime,
        runSequence: train.runSequence,
        passOrStopCode: train.passOrStopCode,
        upDownCode: train.upDownCode,
        linkTrainPoint: train.linkTrainPoint,
        frontLinkTrainQ: train.frontLinkTrainQ,
        backLinkTrainQ: train.backLinkTrainQ,
        arvStayActiveCode: train.arvStayActiveCode,
        dptStayActiveCode: train.dptStayActiveCode,
        stayActiveCode:
          train.arvStayActiveCode === StayActiveCode.STAY &&
          train.dptStayActiveCode === StayActiveCode.STAY
            ? StayActiveCode.STAY
            : StayActiveCode.ACTIVE,
        stopType: train.passOrStopCode,
        plannedPassOrStopCode: train.passOrStopCode,
        resultedArvFlag: train.resultedArvFlag,
        tokuhatsuFg: train.tokuhatsuFg,
        bothN: train.bothN,
        arvRailCode: train.arvRailCode,
        dptRailCode: train.dptRailCode,
        trainType: train.trainType,
        trainNo: train.trainNo,
        runKind: train.runKind,
        dptTrackCode: train.dptTrackCode,
        resultedDptFlag: train.resultedDptFlag,
        stopRate: train.stopRate,
        powerType: train.powerType,
        speedType: train.speedType
      } as TrainLineRun;
      if (station) {
        drawableTrainRunList.push(trainRun);
      }
      trainRunList.push(trainRun);
    }
    trains.push({
      trainNo: tQ.trainNo,
      trainNoName: tQ.trainNoName,
      stayActiveCode: tQ.stayActiveCode,
      chargeFlag: tQ.chargeFlag,
      mainShuntFlag: tQ.mainShuntFlag,
      trainRunList,
      drawableTrainRunList
    });
  }

  return trains; //.filter((t) => t.trainNo === 32);
};

export const mapTimetableData = (stationSequence, diaStationQ, trainQ) => {
  let currentDistance = 0;
  const stations = stationSequence.stationList.map((station) => {
    const diaStation = diaStationQ.find((diaS) => diaS.stationCode === station.stationCode);
    currentDistance += station.distance;
    return {
      stationCode: station.stationCode,
      stationName: diaStation.stationName,
      distance: currentDistance,
      axisDistance: currentDistance,
      trackList: diaStation.trackList
        .sort((t1, t2) => t1.trackCode - t2.trackCode)
        .map((track) => {
          const propQ = {
            ...track.propQ,
            honsenFg: 0,
            shuntFg: 0,
            callonSignal: 0,
            shuntSignal: 0,
            passable: 0,
            chargeFlag: 0,
            overheadLine: 0,
            bothN: 0,
            ngFlag: 0
          };
          return {
            trackName: track.trackName,
            trackCode: track.trackCode,
            homeTrackFg: track.homeTrackFg,
            capBCaD: track.capBCaD,
            capBCaU: track.capBCaU,
            capBPaD: track.capBPaD,
            capBPaU: track.capBPaU,
            trackGroup: 0,
            propaty: 0,
            sameHomeTrack: 0,
            propQ: propQ
          };
        })
    };
  });

  const trains = mapTrains(stations, trainQ);

  return { stations, trains };
};

export const mapPredictTimetableData = (stations, predictedTrainQ, plannedTrainQ) => {
  const trains = mapTrains(stations, predictedTrainQ);
  return trains.map((trainQ) => {
    const mappedItem = {
      ...trainQ,
      trainRunList: trainQ.trainRunList.map((trainRun) => {
        const matchingRunListItem2 = plannedTrainQ
          .find((arr2Item) => arr2Item.trainNo === trainQ.trainNo)
          .trainRunList.find((runListItem2) => runListItem2.stationCode === trainRun.stationCode);

        return {
          ...trainRun,
          plannedArvTime: matchingRunListItem2.plannedArvTime,
          plannedDptTime: matchingRunListItem2 ? matchingRunListItem2.plannedDptTime : undefined, // Handle the case where there's no match
          linkTrainPoint: matchingRunListItem2.linkTrainPoint,
          frontLinkTrainQ: matchingRunListItem2.frontLinkTrainQ,
          backLinkTrainQ: matchingRunListItem2.backLinkTrainQ
        };
      }),
      drawableTrainRunList: trainQ.drawableTrainRunList.map((trainRun) => {
        const matchingRunListItem2 = plannedTrainQ
          .find((arr2Item) => arr2Item.trainNo === trainQ.trainNo)
          .drawableTrainRunList.find(
            (runListItem2) => runListItem2.stationCode === trainRun.stationCode
          );

        return {
          ...trainRun,
          plannedArvTime: matchingRunListItem2.plannedArvTime,
          plannedDptTime: matchingRunListItem2 ? matchingRunListItem2.plannedDptTime : undefined, // Handle the case where there's no match
          linkTrainPoint: matchingRunListItem2.linkTrainPoint,
          frontLinkTrainQ: matchingRunListItem2.frontLinkTrainQ,
          backLinkTrainQ: matchingRunListItem2.backLinkTrainQ
        };
      })
    };
    return mappedItem;
  });
};
