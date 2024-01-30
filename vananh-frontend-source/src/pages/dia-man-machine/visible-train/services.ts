import { TrainDatasource } from '../../../redux/reducers/timetable.reducer';
import {
  DataTypeOptions,
  TrainDirectionOptions,
  VisibleTrainExtraOptions
} from '../../../redux/reducers/visibleTrain.reducer';
import { DrawableTrain, PlatformStation, Station, TrainDirection } from '../chart/types';

const filterLimitDisplayedTrains = (
  trains: DrawableTrain[],
  stations: (Station & PlatformStation)[]
) => {
  return trains.filter((train) => {
    const startStation = train.trainRunList.find(
      (t) => t.runSequence === Math.min(...train.trainRunList.map((t) => t.runSequence))
    )?.stationCode;
    const endStation = train.trainRunList.find(
      (t) => t.runSequence === Math.max(...train.trainRunList.map((t) => t.runSequence))
    )?.stationCode;

    return (
      stations.some((s) => s.stationCode === startStation) &&
      stations.some((s) => s.stationCode === endStation)
    );
  });
};

export function filterRenderableTrains(
  sourceTrains: TrainDatasource,
  stations: (Station & PlatformStation)[],
  options: {
    trainDirectionOptions: TrainDirectionOptions;
    dataTypeOptions: DataTypeOptions;
    visibleTrainExtraOptions: VisibleTrainExtraOptions;
  }
): Partial<TrainDatasource> {
  const sources: TrainDatasource = {
    predictedTrainRuns: options.dataTypeOptions.predicted ? sourceTrains.predictedTrainRuns : [],
    resultedTrainRuns: options.dataTypeOptions.resulted ? sourceTrains.resultedTrainRuns : [],
    plannedTrainRuns: options.dataTypeOptions.planned ? sourceTrains.plannedTrainRuns : []
  };

  const trains = {
    predictedTrainRuns: sources.predictedTrainRuns.filter(
      (t) =>
        (options.trainDirectionOptions.down &&
          t.trainRunList[0].upDownCode === TrainDirection.DOWN) ||
        (options.trainDirectionOptions.up && t.trainRunList[0].upDownCode === TrainDirection.UP)
    ),
    resultedTrainRuns: sources.resultedTrainRuns.filter(
      (t) =>
        (options.trainDirectionOptions.down &&
          t.trainRunList[0].upDownCode === TrainDirection.DOWN) ||
        (options.trainDirectionOptions.up && t.trainRunList[0].upDownCode === TrainDirection.UP)
    ),
    plannedTrainRuns: sources.plannedTrainRuns.filter(
      (t) =>
        (options.trainDirectionOptions.down &&
          t.trainRunList[0].upDownCode === TrainDirection.DOWN) ||
        (options.trainDirectionOptions.up && t.trainRunList[0].upDownCode === TrainDirection.UP)
    )
  };
  
  if (options.visibleTrainExtraOptions.limitDisplayedTrains) {
    trains.plannedTrainRuns = filterLimitDisplayedTrains(trains.plannedTrainRuns, stations);
    trains.resultedTrainRuns = filterLimitDisplayedTrains(trains.resultedTrainRuns, stations);
    trains.predictedTrainRuns = filterLimitDisplayedTrains(trains.predictedTrainRuns, stations);
  }
  return trains;
}
