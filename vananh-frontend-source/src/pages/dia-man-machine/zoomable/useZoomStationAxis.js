import * as d3 from 'd3';

const useZoomStationAxis = ({ zoomTransform, yScale }) => {
  const stationZoomTransform = d3.zoomIdentity.translate(0, zoomTransform.y).scale(zoomTransform.k);
  const stationScale = stationZoomTransform.rescaleY(yScale);
  return { stationScale };
};

export default useZoomStationAxis;
