import { Dispatch, SetStateAction } from 'react';
import { Command } from '../services';
import { TrafficRestrictionData } from '../traffic-restriction/TrafficRestriction';
import { AnyAction } from 'redux';
import {
  TrainDatasource,
  setSourceTrains,
  setTrains
} from '../../../redux/reducers/timetable.reducer';
import { VisibleTrainOptions } from '../../../redux/reducers/visibleTrain.reducer';
import clone from 'lodash.clonedeep';
import { filterRenderableTrains } from '../visible-train/services';
import { PlatformStation, Station } from '../chart/types';

interface DataSourceModifier {
  dispatch: Dispatch<AnyAction>;
  setTrafficRestrictions: Dispatch<SetStateAction<TrafficRestrictionData[]>>;
}

export class ResetCommand implements Command {
  constructor(
    private sourceTrains: TrainDatasource,
    private stations: (Station & PlatformStation)[],
    private options: VisibleTrainOptions,
    private modifier: DataSourceModifier
  ) {}

  execute(): void {
    const sources: TrainDatasource = {
      predictedTrainRuns: clone(this.sourceTrains.plannedTrainRuns),
      resultedTrainRuns: this.sourceTrains.resultedTrainRuns,
      plannedTrainRuns: this.sourceTrains.plannedTrainRuns
    };
    const filteredOriginalSources = filterRenderableTrains(sources, this.stations, {
      trainDirectionOptions: this.options.trainDirection,
      dataTypeOptions: this.options.dataType,
      visibleTrainExtraOptions: this.options.optionVisibleTrainExtra
    });
    this.modifier.dispatch(setSourceTrains(sources));
    this.modifier.dispatch(setTrains(filteredOriginalSources));
    this.modifier.setTrafficRestrictions([]);
  }

  undo(): void {
    throw new Error('Method not implemented.');
  }
}
