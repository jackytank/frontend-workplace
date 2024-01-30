import * as d3 from 'd3';
import { zoom } from 'd3-zoom';
import { useEffect, useState } from 'react';
import { BASE_DAY } from '../chart/Chart';

export const INITIAL_SCALE = 1;

const useZoomChart = ({ svgRef }) => {
  const [zoomSource, setZoomSource] = useState(() => ({
    transform: d3.zoomIdentity.scale(INITIAL_SCALE)
  }));

  useEffect(() => {
    const svg = d3.select(svgRef.current); // as SVGSVGElement

    // Define the zoom behavior
    const zoomBehavior = zoom()
      .scaleExtent([0.25, 20]) // Define the zoom scale limits
      .translateExtent([
        [timetable.x(new Date(`${BASE_DAY}T00:00:00Z`)), 0],
        [Infinity, Infinity]
      ])
      .on('zoom', zoomed); // Attach the zoomed function

    setZoomSource((o) => ({ ...o, zoomBehavior }));

    // Add space for chart controls on top-right
    svg.style('margin-top', '25px');

    // Apply the zoom behavior to the SVG element
    svg.select('.zoom-area').call(zoomBehavior);

    // Initial zoom setup
    svg.select('.zoom-area').call(zoomBehavior.transform, zoomSource.transform);

    // Define the zoomed function to update the chart on zoom
    function zoomed(event) {
      const { transform } = event;
      setZoomSource((o) => ({ ...o, transform }));
    }
  }, []); // zoomTransform

  const zoomTransform = zoomSource.transform;
  // Get rounded value for display
  const roundedScale = Math.round(zoomTransform.k * 100) / 100;
  return { roundedScale, zoomSource };
};

export default useZoomChart;
