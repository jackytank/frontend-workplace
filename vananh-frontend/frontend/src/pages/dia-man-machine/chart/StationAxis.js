import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import useZoomStationAxis from '../zoomable/useZoomStationAxis';
import { useSelector } from 'react-redux';
import { useEditPlatform } from '../edit-platform/hooks/useEditPlatform';

export const PLATFORM_CONSUME_DISTANCE = timetable.y ? timetable.y(30) : 30;

export const EXPANDED_PLATFORM_PADDING_CONSUME = timetable.y ? timetable.y(10) : 10;

const buildStationsFromTrackList = (station) => {
  let axisDistance = station.axisDistance;
  return station.trackList
    .map((track) => {
      axisDistance += PLATFORM_CONSUME_DISTANCE;
      return {
        isPlatform: true,
        isExpandedPlatform: true,
        stationName: track.trackName,
        parentStationName: station.stationName,
        axisDistance: axisDistance,
        distance: station.distance,
        stationCode: station.stationCode,
        platformTrackCode: track.trackCode,
        homeTrackFg: track.homeTrackFg
      };
    })
    .concat({
      isPadding: true,
      isPlatform: true,
      isExpandedPlatform: true,
      axisDistance: axisDistance + EXPANDED_PLATFORM_PADDING_CONSUME,
      distance: station.distance,
      stationCode: station.stationCode
    });
};

function StationAxis({ svgRef, stations = [], setStations, zoomTransform }) {
  const {
    dimension: { height, width }
  } = useSelector((state) => state.timetableDimensionReducer);
  const { isEditArrivalDeparturePlatformPanelVisible } = useSelector(
    (state) => state.editArrivalDeparturePlatformReducer
  );
  const { dispatchEvent: dispatchEditPlatformEvent } = useEditPlatform();

  const y = useRef(d3.scaleLinear().range([height, 0]));
  y.current.domain([d3.max(stations, (s) => s.axisDistance) + 20, -20]);

  const { stationScale } = useZoomStationAxis({
    zoomTransform,
    yScale: y.current
  });

  useEffect(() => {
    timetable.y = stationScale;

    const svg = d3.select(svgRef.current);
    svg.selectAll('.y-axis').remove();
    const yAxis = svg
      .select('.y-axis-container')
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(timetable.y).tickValues(0));

    const stationGroup = yAxis
      .selectAll('.station-label')
      .data(stations)
      .enter()
      .append('g')
      .attr('class', 'station-group')
      .attr('station-platform', (d) => (d.isPlatform ? 1 : 0))
      .attr('clip-path', 'url(#clip1)'); // Apply the clip path to station labels

    const stationLabels = stationGroup
      .append('text')
      .attr('class', 'station-label')
      .attr('x', -10) // Adjust the distance from the y-axis
      .attr('y', (d) => timetable.y(d.axisDistance))
      //.attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text((d) => d.stationName)
      .style('fill', 'currentColor')
      .style('font-size', '12px');

    stationLabels.on('click', function (event, clickedStation) {
      if (isEditArrivalDeparturePlatformPanelVisible) {
        dispatchEditPlatformEvent(event);
      }

      // Ignore expand on platform
      if (clickedStation.isPlatform) {
        return;
      }

      const totalConsumedDistance =
        clickedStation.trackList.length * PLATFORM_CONSUME_DISTANCE +
        EXPANDED_PLATFORM_PADDING_CONSUME;

      // Remove platform labels after clicking again
      if (clickedStation.isExpandedPlatform) {
        clickedStation.isExpandedPlatform = !clickedStation.isExpandedPlatform;
        setStations((currentStations) =>
          currentStations
            .filter(
              // remove platforms of collapsed station
              (station) =>
                (station.isPlatform !== true &&
                  station.stationCode === clickedStation.stationCode) ||
                station.stationCode !== clickedStation.stationCode
            )
            .map((station) => {
              if (station.stationCode <= clickedStation.stationCode) {
                if (station.stationCode === clickedStation.stationCode) {
                  return {
                    ...station,
                    isExpandedPlatform: false
                  };
                }
                return station;
              }
              return {
                ...station,
                axisDistance: station.axisDistance - totalConsumedDistance
              };
            })
        );
        return;
      }

      const newStations = buildStationsFromTrackList(clickedStation);
      setStations((currentStations) => [
        ...currentStations.map((station) => {
          if (station.stationCode <= clickedStation.stationCode) {
            if (station.stationCode === clickedStation.stationCode) {
              return {
                ...station,
                isExpandedPlatform: true
              };
            }
            return station;
          }
          return {
            ...station,
            axisDistance: station.axisDistance + totalConsumedDistance
          };
        }),
        ...newStations
      ]);

      clickedStation.isExpandedPlatform = true;
    });

    // Station grid line
    const stationGridLines = stationGroup
      .append('line')
      .attr('class', 'station-grid-line')
      .attr('y1', (d) => {
        return timetable.y(d.axisDistance);
      })
      .attr('x2', width)
      // .attr('clip-path', 'url(#clip)') // Apply the clip path to station labels
      .attr('y2', (d) => {
        return timetable.y(d.axisDistance);
      });

    stationGridLines.on('click', (e) => {
      if (isEditArrivalDeparturePlatformPanelVisible) {
        dispatchEditPlatformEvent(e);
      }
    });
    return () => yAxis.remove();
  }, [stations, stationScale]);

  return <></>;
}

export default StationAxis;
