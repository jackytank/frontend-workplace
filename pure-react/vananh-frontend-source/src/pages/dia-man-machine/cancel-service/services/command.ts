import clone from 'lodash.clonedeep';
import { Dispatch, SetStateAction } from 'react';
import { AnyAction } from 'redux';
import {
  TrainDatasource,
  setSourceTrains,
  setTrains
} from '../../../../redux/reducers/timetable.reducer';
import {
  DrawableTrain,
  PlatformStation,
  Station,
  StayActiveCode,
  TrainDirection,
  TrainLineRun,
  TrainPassOrStopCode
} from '../../chart/types';
import { Command } from '../../services';
import { CancelServiceData } from '../CancelService';
import { VisibleTrainOptions } from '../../../../redux/reducers/visibleTrain.reducer';
import { filterRenderableTrains } from '../../visible-train/services';
import { parseDateTime } from '../../chart/Chart';

interface DataCurrentTrain {
  trainNo: number;
  dataCurrentTrainRun: DataCurrentTrainRun[];
  [key: string]: any;
}

interface DataCurrentTrainRun {
  runSequence: number;
  [key: string]: any;
}

interface DataPreviousTrain {
  trainNo: number;
  trainRunSequence: number;
  backLinkTrainQ: [number, number, number];
}

interface DataNextTrain {
  trainNo: number;
  trainRunSequence: number;
  frontLinkTrainQ: [number, number, number];
}

export interface DataChange {
  previousTrain: DataPreviousTrain | null;
  currentTrain: DataCurrentTrain | null;
  nextTrain: DataNextTrain | null;
}

export class CancelServiceCommand implements Command {
  constructor(
    private modifier: Dispatch<AnyAction>,
    private setCancelServiceDataChange: Dispatch<SetStateAction<DataChange[]>>,
    private cancelServiceData: CancelServiceData,
    private sourceTrains: TrainDatasource,
    private stations: (Station & PlatformStation)[],
    private trainTypeData: [],
    private companyName: string,
    private options: VisibleTrainOptions
  ) {}
  private dataChange;
  execute(): void {
    const cloneSourceTrains = clone(this.sourceTrains);
    const canceledTrain = cloneSourceTrains.predictedTrainRuns.find(
      (train) => train.trainNo === this.cancelServiceData.trainNo
    );
    if (canceledTrain) {
      const dataCurrentTrain: DataCurrentTrain = {
        trainNo: canceledTrain.trainNo,
        dataCurrentTrainRun: []
      };
      let dataPreviousTrain: DataPreviousTrain | null = null;
      let dataNextTrain: DataNextTrain | null = null;
      // Update previous train
      if (
        this.cancelServiceData.stationStartCode ===
          canceledTrain.drawableTrainRunList[0].stationCode &&
        canceledTrain.drawableTrainRunList[0].stationCode ===
          canceledTrain.trainRunList[0].stationCode
      ) {
        const previousTrain = cloneSourceTrains.predictedTrainRuns.find(
          (train) =>
            train.drawableTrainRunList.at(-1).backLinkTrainQ[0] ===
            canceledTrain.drawableTrainRunList[0].linkTrainPoint
        );
        if (previousTrain) {
          canceledTrain.drawableTrainRunList[0].frontLinkTrainQ[0] = -1;
          previousTrain.drawableTrainRunList.at(-1).backLinkTrainQ[0] = -1;
          dataCurrentTrain.firstTrainRunSequence =
            canceledTrain.drawableTrainRunList[0].runSequence;
          dataCurrentTrain.frontLinkTrainQ = canceledTrain.drawableTrainRunList[0].frontLinkTrainQ;
          dataPreviousTrain = {
            trainNo: previousTrain.trainNo,
            trainRunSequence: previousTrain.drawableTrainRunList.at(-1).runSequence,
            backLinkTrainQ: previousTrain.drawableTrainRunList.at(-1).backLinkTrainQ
          };
        }
      }
      // Update next train
      if (
        this.cancelServiceData.stationEndCode ===
          canceledTrain.drawableTrainRunList.at(-1).stationCode &&
        canceledTrain.drawableTrainRunList.at(-1).stationCode ===
          canceledTrain.trainRunList.at(-1).stationCode
      ) {
        const nextTrain = cloneSourceTrains.predictedTrainRuns.find(
          (train) =>
            train.drawableTrainRunList[0].frontLinkTrainQ[0] ===
            canceledTrain.drawableTrainRunList.at(-1).linkTrainPoint
        );
        if (nextTrain) {
          canceledTrain.drawableTrainRunList.at(-1).backLinkTrainQ[0] = -1;
          nextTrain.drawableTrainRunList[0].frontLinkTrainQ[0] = -1;
          dataCurrentTrain.lastTrainRunSequence =
            canceledTrain.drawableTrainRunList.at(-1).runSequence;
          dataCurrentTrain.backLinkTrainQ =
            canceledTrain.drawableTrainRunList.at(-1).backLinkTrainQ;
          dataNextTrain = {
            trainNo: nextTrain.trainNo,
            trainRunSequence: nextTrain.drawableTrainRunList[0].runSequence,
            frontLinkTrainQ: nextTrain.drawableTrainRunList[0].frontLinkTrainQ
          };
        }
      }

      if (
        this.cancelServiceData.stationStartCode === canceledTrain.trainRunList[0].stationCode &&
        this.cancelServiceData.stationEndCode === canceledTrain.trainRunList.at(-1).stationCode
      ) {
        canceledTrain.stayActiveCode = StayActiveCode.STAY;
        dataCurrentTrain.stayActiveCode = StayActiveCode.STAY;
      }

      if (canceledTrain.drawableTrainRunList[0].upDownCode === TrainDirection.DOWN) {
        canceledTrain.drawableTrainRunList.forEach((trainRun) => {
          if (
            trainRun.stationCode >= this.cancelServiceData.stationStartCode &&
            trainRun.stationCode <= this.cancelServiceData.stationEndCode
          ) {
            const dataCurrentTrainRun: DataCurrentTrainRun = { runSequence: trainRun.runSequence };
            this.updateTrainRun(canceledTrain, trainRun, dataCurrentTrainRun);
            dataCurrentTrain.dataCurrentTrainRun.push(dataCurrentTrainRun);
          }
        });
      } else {
        canceledTrain.drawableTrainRunList.forEach((trainRun) => {
          if (
            trainRun.stationCode <= this.cancelServiceData.stationStartCode &&
            trainRun.stationCode >= this.cancelServiceData.stationEndCode
          ) {
            const dataCurrentTrainRun: DataCurrentTrainRun = { runSequence: trainRun.runSequence };
            this.updateTrainRun(canceledTrain, trainRun, dataCurrentTrainRun);
            dataCurrentTrain.dataCurrentTrainRun.push(dataCurrentTrainRun);
          }
        });
      }
      this.dataChange = {
        previousTrain: dataPreviousTrain,
        currentTrain: dataCurrentTrain,
        nextTrain: dataNextTrain
      };
      this.setCancelServiceDataChange((data) => [...data, this.dataChange]);
    }
    // Update train line order
    // const index = cloneSourceTrains.predictedTrainRuns.indexOf(canceledTrain);
    // if (index > -1) {
    //   cloneSourceTrains.predictedTrainRuns.splice(index, 1);
    //   cloneSourceTrains.predictedTrainRuns.push(canceledTrain);
    // }
    this.modifier(setSourceTrains(cloneSourceTrains));
    this.modifier(
      setTrains(
        filterRenderableTrains(cloneSourceTrains, this.stations, {
          dataTypeOptions: this.options.dataType,
          trainDirectionOptions: this.options.trainDirection,
          visibleTrainExtraOptions: this.options.optionVisibleTrainExtra
        })
      )
    );
  }

  private updateTrainRun(
    canceledTrain: DrawableTrain,
    trainRun: TrainLineRun,
    dataCurrentTrainRun: DataCurrentTrainRun
  ): void {
    trainRun.stayActiveCode = StayActiveCode.STAY;
    if (trainRun.stationCode === this.cancelServiceData.stationStartCode) {
      trainRun.dptStayActiveCode = StayActiveCode.STAY;
      dataCurrentTrainRun.dptStayActiveCode = StayActiveCode.STAY;
      this.changePassCode(canceledTrain, trainRun, TrainPassOrStopCode.STOP, dataCurrentTrainRun);
    } else if (trainRun.stationCode === this.cancelServiceData.stationEndCode) {
      trainRun.arvStayActiveCode = StayActiveCode.STAY;
      dataCurrentTrainRun.arvStayActiveCode = StayActiveCode.STAY;
      this.changePassCode(canceledTrain, trainRun, TrainPassOrStopCode.STOP, dataCurrentTrainRun);
    } else {
      trainRun.arvStayActiveCode = StayActiveCode.STAY;
      dataCurrentTrainRun.arvStayActiveCode = StayActiveCode.STAY;
      trainRun.dptStayActiveCode = StayActiveCode.STAY;
      dataCurrentTrainRun.dptStayActiveCode = StayActiveCode.STAY;
    }
  }

  private changePassCode(
    canceledTrain: DrawableTrain,
    trainRun: TrainLineRun,
    passCode: TrainPassOrStopCode,
    dataCurrentTrainRun: DataCurrentTrainRun
  ) {
    if (!this.checkCanChangePassCode(canceledTrain, trainRun, passCode)) return;

    if (
      trainRun.passOrStopCode === TrainPassOrStopCode.PASS &&
      passCode === TrainPassOrStopCode.STOP
    ) {
      trainRun.simulatedArvTime = trainRun.simulatedDptTime;
      dataCurrentTrainRun.simulatedArvTime = trainRun.simulatedDptTime;
    }
    if (
      trainRun.passOrStopCode === TrainPassOrStopCode.STOP &&
      passCode === TrainPassOrStopCode.PASS
    ) {
      trainRun.simulatedArvTime = '582:32:31';
      dataCurrentTrainRun.simulatedArvTime = '582:32:31';
    }
    trainRun.passOrStopCode = passCode;
    dataCurrentTrainRun.passOrStopCode = passCode;
  }

  private checkCanChangePassCode(
    canceledTrain: DrawableTrain,
    trainRun: TrainLineRun,
    passCode: TrainPassOrStopCode
  ) {
    const runSequenceStartPoint = Math.min(
      ...canceledTrain.drawableTrainRunList.map((t) => t.runSequence)
    );
    const runSequenceEndPoint = Math.max(
      ...canceledTrain.drawableTrainRunList.map((t) => t.runSequence)
    );
    if (
      trainRun.runSequence === runSequenceStartPoint ||
      trainRun.runSequence === runSequenceEndPoint
    ) {
      return false;
    }

    if (canceledTrain.mainShuntFlag === 1) return false;

    if (trainRun.resultedArvFlag !== 0) return false;

    if (!parseDateTime(trainRun.simulatedDptTime)) {
      return false;
    }

    if (trainRun.tokuhatsuFg !== 0) return false;

    const simTrainType = this.trainTypeData.find(
      (type) => type['trainTypeCode'] === canceledTrain.chargeFlag
    );
    if (!simTrainType || !Object.hasOwn(simTrainType, 'type')) {
      return false;
    }
    const section = simTrainType['type'];
    const station = this.stations.find((station) => station.stationCode === trainRun.stationCode);
    if (!station) {
      return false;
    }
    const trackLine = station.trackList.find(
      (track) => track.trackCode === trainRun.plannedTrackCode
    );
    if (!trackLine) {
      return false;
    }

    if (passCode === TrainPassOrStopCode.STOP) {
      if (trackLine['homeTrackFg'] === 0 && section === 1) {
        return false;
      }
      let stopType = trainRun.stopType;
      if (section !== 2 && trainRun.plannedPassOrStopCode === TrainPassOrStopCode.PASS) {
        stopType = 2;
      }
      const capB = this.getCapB(trackLine, stopType, section, trainRun.upDownCode);
      let retB = trainRun.bothN;
      if (this.companyName === 'JACROS' && section === 2) {
        retB = 62;
        if (trainRun.plannedPassOrStopCode === TrainPassOrStopCode.STOP) {
          retB = capB;
        }
      }
      if (capB !== 0 && capB < retB) {
        return false;
      }
    } else {
      const propQ = trackLine.propQ.find(
        (proQ) =>
          trackLine['propaty'] === 0 &&
          proQ.seqId === trainRun.dptRailCode &&
          proQ['upDownCode'] === trainRun.upDownCode
      );
      if (!propQ) return false;
      if (propQ['passable'] === 1) {
        if (propQ['chargeFlag'] === 1) {
          if (trainRun.trainType === 1) {
            return false;
          }
        } else {
          return false;
        }
      }
      if (
        trainRun.runSequence !== runSequenceStartPoint &&
        trainRun.arvRailCode !== trainRun.dptRailCode
      ) {
        const trainRunIndex = canceledTrain.drawableTrainRunList.indexOf(trainRun);
        const beforeTrainRun = canceledTrain.drawableTrainRunList[trainRunIndex - 1];
        const beforeTrackLine = this.stations
          .find((station) => station.stationCode === beforeTrainRun.stationCode)
          ?.trackList.find((track) => track.trackCode === beforeTrainRun.plannedTrackCode);
        const beforePropQ = beforeTrackLine?.propQ.find(
          (proQ) =>
            beforeTrainRun['propaty'] === 0 &&
            proQ.seqId === trainRun.dptRailCode &&
            proQ['upDownCode'] === trainRun.upDownCode
        );
        if (!beforePropQ) return false;
        if (propQ['honsenFg'] === 0 && beforePropQ['honsenFg']) return false;
      }
    }
    return true;
  }

  private getCapB(trackLine, stopType, section, upDownCode) {
    let capB = 0;
    if (section === 2 || stopType !== 1) {
      if (upDownCode === TrainDirection.UP) {
        capB = trackLine.capBCaD;
      } else {
        capB = trackLine.capBCaU;
      }
    } else {
      if (upDownCode === TrainDirection.UP) {
        capB = trackLine.capBPaD;
      } else {
        capB = trackLine.capBPaU;
      }
    }
    if (this.companyName === 'JACROS' && capB === 99) {
      capB = 1;
    }
    return capB;
  }

  undo(): void {
    this.modifier(setSourceTrains(this.sourceTrains));
    this.modifier(
      setTrains(
        filterRenderableTrains(this.sourceTrains, this.stations, {
          dataTypeOptions: this.options.dataType,
          trainDirectionOptions: this.options.trainDirection,
          visibleTrainExtraOptions: this.options.optionVisibleTrainExtra
        })
      )
    );
    this.setCancelServiceDataChange((data) =>
      data.filter((d) => d.currentTrain?.trainNo !== this.dataChange.currentTrain?.trainNo)
    );
  }
}
