import { Fragment, useEffect } from 'react';
import '../../assets/styles/component/chart/chart.css';
import timetableApi from '../../services/apis/timetableApi';
import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';
//import * as d3 from 'd3';

export default function Chart() {
  const { time } = useSelector((state) => state.timetableReducer);
  console.log(time);
  useEffect(() => {
    timetableApi
      .getStationSequence('OTHER')
      .then((response) => {
        if (response.data && response.data.length) {
          console.log('Station sequence: ', response.data);
        }
        <Alert severity="error">Get station sequence error!</Alert>;
      })
      .catch(() => {
        <Alert severity="error">Get station sequence error!</Alert>;
      });
    timetableApi
      .getTimetableData('OTHER')
      .then((response) => {
        if (response.data && response.data.length) {
          console.log('Timetable data: ', response.data);
        }
        <Alert severity="error">Get station sequence error!</Alert>;
      })
      .catch(() => {
        <Alert severity="error">Get configuration error!</Alert>;
      });
  }, []);
  return (
    <Fragment>
      <div id="chart"></div>
      <button id="zoom">Zoom</button>
    </Fragment>
  );
}
