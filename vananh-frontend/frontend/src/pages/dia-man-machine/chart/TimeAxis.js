import { useEffect } from 'react';
import * as d3 from 'd3';
import { useSelector } from 'react-redux';
import { BASE_DAY } from './Chart';
import useZoomTimeAxis from '../zoomable/useZoomTimeAxis';

const getColorForTick = (tickTime) => {
  const minute = tickTime.getMinutes();
  if (minute === 0) return 'red';
  if (minute === 30) return 'green';
  return 'blue';
};

const getFontSizeForTickTime = (tickTime) => {
  const minute = tickTime.getMinutes();
  if (minute === 0) return '15px';
  if (minute === 30) return '15px';
  return '11px';
};

const timeZone = 7; // GMT+7; can get from server config

const TimeAxis = ({ svgRef, scale, zoomSource }) => {
  const {
    dimension: { height, width }
  } = useSelector((state) => state.timetableDimensionReducer);
  const { time } = useSelector((state) => state.timetableReducer);

  const x = d3.scaleTime().range([0, width]);

  const date = new Date(`${BASE_DAY}T00:00:00Z`);
  date.setHours(+time.hour + timeZone);
  date.setMinutes(+time.minute - 10);

  const maxDate = new Date(date);
  maxDate.setHours(
    maxDate.getHours() + (width > 1000 ? (scale <= 0.8 ? 5 : 4) : scale <= 0.8 ? 3 : 2)
  );

  x.domain([date, maxDate]);

  const { timeScale, timeScaleFactor } = useZoomTimeAxis({
    svgRef,
    zoomTransform: zoomSource.transform,
    xScale: x,
    zoomSource
  });

  useEffect(() => {
    timetable.x = timeScale;

    const svg = d3.select(svgRef.current);
    svg.selectAll('.x-axis').remove();

    const currentTick = new Date(date);
    const tickValues = [];

    while (currentTick <= maxDate) {
      tickValues.push(new Date(currentTick));
      if (scale <= 0.8) {
        currentTick.setHours(currentTick.getHours() + 1);
      } else {
        currentTick.setMinutes(currentTick.getMinutes() + 10);
      }
    }

    const xAxis = svg
      .select('.x-axis-container')
      .append('g')
      .attr('class', 'x-axis')
      .style('font-size', '13px')
      .style('color', 'blue')
      .call(
        d3
          .axisTop(timetable.x)
          .tickSize(-height)
          .tickFormat((d) => {
            const format = d3.utcFormat('%-H:%M');
            const formattedTime = format(d);
            const [hour, minute] = formattedTime.split(':');
            return minute === '00' ? hour : minute;
          })
          .ticks(timeScaleFactor >= 1 ? d3.timeMinute.every(10) : d3.timeHour.every(1)) // If scale factor >= 1. We display minute tick. otherwise display hour tick only.
      );

    xAxis
      .selectAll('.tick line, .tick text')
      .style('color', (d) => getColorForTick(d))
      .style('font-size', (d) => getFontSizeForTickTime(d));

    const numTicks = tickValues.length; // Số lượng tickValues
    const axisWidth = width / numTicks; // Tính toán chiều rộng cần thiết

    xAxis.style('width', axisWidth + 'px'); // Đặt chiều rộng trong CSS
  }, [timeScale]);

  return <></>;
};

export default TimeAxis;
