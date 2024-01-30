import { TimeState } from '../redux/reducers/timetable.reducer';

export {};

declare global {
  interface Window {
    scatter: d3.Selection<unknown>;
  }
  // eslint-disable-next-line no-var
  var timetable: TimeTable;
}

interface TimeTable {
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
  setting: Setting;
}

interface Setting {
  companyName: string;
  time: TimeState;
}
