import * as d3 from 'd3';
import { PointerEvent } from 'react';
import { useDispatch } from 'react-redux';
import { setForm } from '../../../../redux/reducers/edit-platform.reducer';
import { PlatformStation, Station, TrainLineRun } from '../../chart/types';

export const useEditPlatform = () => {
  const dispatch = useDispatch();

  const dispatchEvent = (e: PointerEvent, src?: 'TRAIN_LINE' | 'STATION') => {
    if (src === 'TRAIN_LINE') {
      const trainLineRun = d3
        .select<SVGPathElement, TrainLineRun>(e.target as SVGPathElement)
        .datum();
      dispatch(
        setForm({
          train: { trainNo: trainLineRun.trainNo, trainNoName: trainLineRun.trainNoName },
          station: undefined,
          platform: undefined
        })
      );
      return;
    }
    const station = d3
      .select<SVGGElement, Station & PlatformStation>(
        (e.target as SVGPathElement).parentElement as unknown as SVGGElement
      )
      .datum();

    if (station.isPadding) {
      // ignore event on padding platform
      return;
    }

    if (station.isPlatform) {
      // if event fired on platform, set station data automaticially.
      dispatch(
        setForm({
          station: { stationCode: station.stationCode, stationName: station.parentStationName },
          platform: {
            trackCode: station.platformTrackCode,
            trackName: station.stationName,
            homeTrackFg: station['homeTrackFg']
          }
        })
      );
      return;
    }

    dispatch(
      setForm({
        station: { stationCode: station.stationCode, stationName: station.stationName },
        platform: undefined
      })
    );
  };

  return {
    dispatchEvent
  };
};
