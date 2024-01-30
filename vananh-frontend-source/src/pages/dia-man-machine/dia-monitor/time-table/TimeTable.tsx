import TimeTableHeader from './TimeTableHeader';
import TimeTableRow from './TimeTableRow';
import './timeTable.css';

type Props = { timeTableColumns; train };
const TimeTable = ({ timeTableColumns, train }: Props) => {
  return (
    <table aria-label="custom pagination table">
      <TimeTableHeader timeTableColumns={timeTableColumns} />
      <tbody>
        {train.trainRunList.map((trainRun, index) => (
          <TimeTableRow
            timeTableColumns={timeTableColumns}
            train={train}
            trainRun={trainRun}
            index={index}
          />
        ))}
      </tbody>
    </table>
  );
};

export default TimeTable;
