import * as d3 from 'd3';

const useZoomTimeAxis = ({ svgRef, zoomTransform, xScale, zoomSource }) => {
  // Handler for update x-axis length/range
  if (timetable.x && timetable.x.range()[1] !== xScale.range()[1]) {
    const svg = d3.select(svgRef.current);
    // Keep track the current first x domain. Using like pivot when rescale the axis
    const pivotX = timetable.x?.domain()[0];
    const scaleFactor = zoomTransform.k;

    // Get x-coordinate of the pivot
    const newX = xScale(pivotX);

    const yTranslation = zoomTransform.y;

    // Create new transform with x translation base on pivot
    const newTransform = d3.zoomIdentity.scale(scaleFactor).translate(-newX);

    // Bind y translation using old transform
    newTransform.y = yTranslation;

    // Update zoom transform
    svg.select('.zoom-area').call(zoomSource.zoomBehavior.transform, newTransform);

    return { timeScale: newTransform.rescaleX(xScale), timeScaleFactor: scaleFactor };
  }
  const timeZoomTransform = d3.zoomIdentity.translate(zoomTransform.x).scale(zoomTransform.k);
  const roundedScale = Math.round(timeZoomTransform.k * 100) / 100;
  const timeScale = timeZoomTransform.rescaleX(xScale);
  return { timeScale, timeScaleFactor: roundedScale };
};

export default useZoomTimeAxis;
