import { TrainPassOrStopCode } from '../../chart/types';

const TimeTableRow = ({ timeTableColumns, train, trainRun, index }) => {
  let plannedArvTimeHour = '';
  let plannedArvTimeMinute = '';
  let plannedArvTimeSecond = '';
  let simulatedArvTimeHour = '';
  let simulatedArvTimeMinute = '';
  let simulatedArvTimeSecond = '';
  let delayArvTimeHour = '';
  let delayArvTimeMinute = '';
  let delayArvTimeSecond = '';
  let arvTimeSpecifiedHour = '';
  let arvTimeSpecifiedMinute = '';
  let arvTimeSpecifiedSecond = '';
  if (index > 0) {
    if (trainRun.passOrStopCode === TrainPassOrStopCode.PASS) {
      plannedArvTimeHour = '-';
      plannedArvTimeMinute = '-';
      plannedArvTimeSecond = '-';
      simulatedArvTimeHour = '-';
      simulatedArvTimeMinute = '-';
      simulatedArvTimeSecond = '-';
    } else {
      const plannedArvTime = trainRun.plannedArvTime.split(':');
      plannedArvTimeHour = convertAndCheckTime(plannedArvTime[0]);
      plannedArvTimeMinute = plannedArvTime[1];
      plannedArvTimeSecond = plannedArvTime[2];

      const simulatedArvTime = trainRun.simulatedArvTime.split(':');
      simulatedArvTimeHour = convertAndCheckTime(simulatedArvTime[0]);
      simulatedArvTimeMinute = simulatedArvTime[1];
      simulatedArvTimeSecond = simulatedArvTime[2];

      if (trainRun.delayTime !== 0) {
        const delayArvTimeSecondNum = trainRun.delayTime % 60;
        delayArvTimeSecond = delayArvTimeSecondNum.toString();
        const delayArvTimeMinuteNum = ((trainRun.delayTime - delayArvTimeSecondNum) / 60) % 60;
        delayArvTimeMinute = delayArvTimeMinuteNum.toString();
        const delayArvTimeHourNum =
          (trainRun.delayTime - delayArvTimeSecondNum - delayArvTimeMinuteNum * 60) / 3600;
        delayArvTimeHour = delayArvTimeHourNum.toString();
      }
    }

    if (trainRun.arvTimeSpecified !== '') {
      const arvTimeSpecified = trainRun.arvTimeSpecified.split(':');
      arvTimeSpecifiedHour = convertAndCheckTime(arvTimeSpecified[0]);
      arvTimeSpecifiedMinute = arvTimeSpecified[1];
      arvTimeSpecifiedSecond = arvTimeSpecified[2];
    }
  }

  let plannedDptTimeHour = '';
  let plannedDptTimeMinute = '';
  let plannedDptTimeSecond = '';
  let simulatedDptTimeHour = '';
  let simulatedDptTimeMinute = '';
  let simulatedDptTimeSecond = '';
  let dptTimeSpecifiedHour = '';
  let dptTimeSpecifiedMinute = '';
  let dptTimeSpecifiedSecond = '';
  if (index !== train.trainRunList.length - 1) {
    const plannedDptTime = trainRun.plannedDptTime.split(':');
    plannedDptTimeHour = convertAndCheckTime(plannedDptTime[0]);
    plannedDptTimeMinute = plannedDptTime[1];
    plannedDptTimeSecond = plannedDptTime[2];

    const simulatedDptTime = trainRun.simulatedDptTime.split(':');
    simulatedDptTimeHour = convertAndCheckTime(simulatedDptTime[0]);
    simulatedDptTimeMinute = simulatedDptTime[1];
    simulatedDptTimeSecond = simulatedDptTime[2];

    // const delayDptTimeHour = '';
    // const delayDptTimeMinute = '';
    // const delayDptTimeSecond = '';
  }

  if (trainRun.dptTimeSpecified !== '') {
    const dptTimeSpecified = trainRun.dptTimeSpecified.split(':');
    dptTimeSpecifiedHour = convertAndCheckTime(dptTimeSpecified[0]);
    dptTimeSpecifiedMinute = dptTimeSpecified[1];
    dptTimeSpecifiedSecond = dptTimeSpecified[2];
  }

  function convertAndCheckTime(inputTimeString) {
    // Convert the input string to a number
    const time = parseInt(inputTimeString, 10);

    // Check if the time is greater than 24
    if (time >= 24) {
      // If yes, return the modified value
      return `0${time - 24}`;
    } else {
      // If not, return the original value
      return `${time}`;
    }
  }

  return (
    <>
      <tr>
        <td className="station-name" rowSpan={2}>
          {trainRun.stationName}
        </td>
        <td>{plannedArvTimeHour}</td>
        <td>{plannedArvTimeMinute}</td>
        <td>{plannedArvTimeSecond}</td>
        {timeTableColumns[0].isActive && <td>{simulatedArvTimeHour}</td>}
        {timeTableColumns[0].isActive && <td>{simulatedArvTimeMinute}</td>}
        {timeTableColumns[0].isActive && <td>{simulatedArvTimeSecond}</td>}
        {timeTableColumns[1].isActive && <td>{delayArvTimeHour}</td>}
        {timeTableColumns[1].isActive && <td>{delayArvTimeMinute}</td>}
        {timeTableColumns[1].isActive && <td>{delayArvTimeSecond}</td>}
        {timeTableColumns[2].isActive && <td>{arvTimeSpecifiedHour}</td>}
        {timeTableColumns[2].isActive && <td>{arvTimeSpecifiedMinute}</td>}
        {timeTableColumns[2].isActive && <td>{arvTimeSpecifiedSecond}</td>}
        {timeTableColumns[3].isActive && <td>{trainRun.plannedTrackName}</td>}
        {timeTableColumns[3].isActive && (
          <td>{trainRun.trackCode !== trainRun.planedTrackCode ? trainRun.trackName : ''}</td>
        )}
        {timeTableColumns[4].isActive && <td>{trainRun.arrivalOrder}</td>}
        {timeTableColumns[4].isActive && <td></td>}
        {timeTableColumns[5].isActive && <td>{trainRun.lineArrival}</td>}
        {timeTableColumns[6].isActive && <td>{index === 0 ? train.previousOperations : ''}</td>}
        {timeTableColumns[7].isActive && (
          <td rowSpan={2}>{trainRun.tokuhatsuFg === 1 ? 'O' : ''}</td>
        )}
        {timeTableColumns[8].isActive && <td>{trainRun.ArvfinishedOrCancelled}</td>}
        {timeTableColumns[9].isActive && <td>{trainRun.bothN}</td>}
      </tr>
      <tr>
        <td>{plannedDptTimeHour}</td>
        <td>{plannedDptTimeMinute}</td>
        <td>{plannedDptTimeSecond}</td>
        {timeTableColumns[0].isActive && <td>{simulatedDptTimeHour}</td>}
        {timeTableColumns[0].isActive && <td>{simulatedDptTimeMinute}</td>}
        {timeTableColumns[0].isActive && <td>{simulatedDptTimeSecond}</td>}
        {timeTableColumns[1].isActive && <td></td>}
        {timeTableColumns[1].isActive && <td></td>}
        {timeTableColumns[1].isActive && <td></td>}
        {timeTableColumns[2].isActive && <td>{dptTimeSpecifiedHour}</td>}
        {timeTableColumns[2].isActive && <td>{dptTimeSpecifiedMinute}</td>}
        {timeTableColumns[2].isActive && <td>{dptTimeSpecifiedSecond}</td>}
        {timeTableColumns[3].isActive && <td>{trainRun.plannedTrackName}</td>}
        {timeTableColumns[3].isActive && (
          <td>{trainRun.trackCode !== trainRun.planedTrackCode ? trainRun.trackName : ''}</td>
        )}
        {timeTableColumns[4].isActive && <td>{trainRun.departureOrder}</td>}
        {timeTableColumns[4].isActive && <td></td>}
        {timeTableColumns[5].isActive && <td>{trainRun.lineDeparture}</td>}
        {timeTableColumns[6].isActive && (
          <td>{index === train.trainRunList.length - 1 ? train.nextOperations : ''}</td>
        )}
        {timeTableColumns[8].isActive && <td>{trainRun.DptfinishedOrCancelled}</td>}
        {timeTableColumns[9].isActive && <td></td>}
      </tr>
    </>
  );
};

export default TimeTableRow;
