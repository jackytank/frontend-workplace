import { useTranslation } from 'react-i18next';

type Props = { timeTableColumns };
const TimeTableHeader = ({ timeTableColumns }: Props) => {
  const { t } = useTranslation();
  let colSpanArrivalDepartureTime = 3;
  for (let i = 0; i < 3; i++) {
    if (timeTableColumns[i].isActive) {
      colSpanArrivalDepartureTime = colSpanArrivalDepartureTime + 3;
    }
  }
  return (
    <thead>
      <tr>
        <th>{t('station')}</th>
        <th colSpan={colSpanArrivalDepartureTime}>{t('arrivalDepartureTime')}</th>
        {timeTableColumns[3].isActive && <th colSpan={2}>{t('platform')}</th>}
        {timeTableColumns[4].isActive && <th colSpan={2}>{t('arrivalDepartureOrder')}</th>}
        {timeTableColumns[5].isActive && <th>{t('line')}</th>}
        {timeTableColumns[6].isActive && <th>{t('operationT')}</th>}
        {timeTableColumns[7].isActive && <th>{t('specialAssignmentChange')}</th>}
        {timeTableColumns[8].isActive && <th>{t('finishedCancelled')}</th>}
        {timeTableColumns[9].isActive && <th>{t('rollingStocks')}</th>}
      </tr>
      <tr>
        <th></th>
        <th colSpan={3}>{t('plan')}</th>
        {timeTableColumns[0].isActive && <th colSpan={3}>{t('actualForecast')}</th>}
        {timeTableColumns[1].isActive && <th colSpan={3}>{t('delay')}</th>}
        {timeTableColumns[2].isActive && <th colSpan={3}>{t('timeSpecified')}</th>}
        {timeTableColumns[3].isActive && <th>{t('beforeChange')}</th>}
        {timeTableColumns[3].isActive && <th>{t('afterChange')}</th>}
        {timeTableColumns[4].isActive && <th>{t('beforeChange')}</th>}
        {timeTableColumns[4].isActive && <th>{t('afterChange')}</th>}
        {timeTableColumns[5].isActive && <th>{t('arrivalDeparture')}</th>}
        {timeTableColumns[6].isActive && <th>{t('preNextOperation')}</th>}
        {timeTableColumns[7].isActive && <th></th>}
        {timeTableColumns[8].isActive && <th></th>}
        {timeTableColumns[9].isActive && <th></th>}
      </tr>
    </thead>
  );
};

export default TimeTableHeader;
