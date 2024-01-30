import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import clone from 'lodash.clonedeep';
import { EditFormData } from '../../../../redux/reducers/edit-platform.reducer';
import { updateSourceTrains } from '../../../../redux/reducers/timetable.reducer';
import { DrawableTrain } from '../../chart/types';
import { Command } from '../../services';

export class EditPlatformCommand implements Command {
  constructor(
    private formData: EditFormData,
    private originalTrain: DrawableTrain,
    private modifier: Dispatch<AnyAction>
  ) {}
  execute(): void {
    const stationCode = this.formData.station?.stationCode;

    const newTrainRun = clone(
      this.originalTrain.drawableTrainRunList.find((tr) => tr.stationCode === stationCode)!
    );
    newTrainRun.plannedTrackCode = this.formData.platform!.trackCode;

    const newTrain: DrawableTrain = clone(this.originalTrain);
    newTrain.drawableTrainRunList = newTrain.drawableTrainRunList.map((t) =>
      t.stationCode === stationCode ? newTrainRun : t
    );
    newTrain.trainRunList = newTrain.trainRunList.map((t) =>
      t.stationCode === stationCode ? newTrainRun : t
    );

    this.modifier(updateSourceTrains(newTrain));
  }

  undo(): void {
    this.modifier(updateSourceTrains(this.originalTrain));
  }
}
