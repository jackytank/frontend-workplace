import {
  HvButton,
  HvDropdown,
  HvGrid,
  HvInput,
  HvTypography
} from '@hitachivantara/uikit-react-core';
import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/config-store';
import { KpiMemo } from '../chart/types';

interface KpiMonitorProps {
  setIsDisplayKpi: any;
}
interface OtherKpis {
  otherKPICode: number;
  otherKPIValue: any[];
}
interface KpiMemoForm {
  delayBeforeRescheduling: {
    paidExpressArrDelay: string;
    otherTrainsArrDelay: string;
    allTrainsArrDelay: string;
    paidExpressDptDelay: string;
    otherTrainsDptDelay: string;
    allTrainsDptDelay: string;
  };
  delayAfterRescheduling: {
    paidExpressArrDelay: string;
    otherTrainsArrDelay: string;
    allTrainsArrDelay: string;
    paidExpressDptDelay: string;
    otherTrainsDptDelay: string;
    allTrainsDptDelay: string;
  };
  cancellationAfterRescheduling: {
    paidExpressArrDelay: string;
    otherTrainsArrDelay: string;
    allTrainsArrDelay: string;
    paidExpressDptDelay: string;
    otherTrainsDptDelay: string;
    allTrainsDptDelay: string;
  };
  otherApis: {
    paidExpress: string;
    otherTrains: string;
    allTrains: string;
  };
}
const KpiMonitor: FC<KpiMonitorProps> = ({ setIsDisplayKpi }) => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const { kpiMemo } = useSelector((state: RootState) => state.kpiMemoReducer);
  const [formKpiMemoRef, setFormKpiMemoRef] = useState({
    delayBeforeRescheduling: {
      paidExpressArrDelay: Math.floor(kpiMemo.chargeArvDelay / 60) + `${t('min')}`,
      otherTrainsArrDelay: Math.floor(kpiMemo.localArvDelay / 60) + `${t('min')}`,
      allTrainsArrDelay: Math.floor(kpiMemo.allArvDelay / 60) + `${t('min')}`,
      paidExpressDptDelay: Math.floor(kpiMemo.chargeDptDelay / 60) + `${t('min')}`,
      otherTrainsDptDelay: Math.floor(kpiMemo.localDptDelay / 60) + `${t('min')}`,
      allTrainsDptDelay: Math.floor(kpiMemo.allDptDelay / 60) + `${t('min')}`
    },
    delayAfterRescheduling: {
      paidExpressArrDelay: Math.floor(kpiMemo.chargeArvDelay / 60) + `${t('min')}`,
      otherTrainsArrDelay: Math.floor(kpiMemo.localArvDelay / 60) + `${t('min')}`,
      allTrainsArrDelay: Math.floor(kpiMemo.allArvDelay / 60) + `${t('min')}`,
      paidExpressDptDelay: Math.floor(kpiMemo.chargeDptDelay / 60) + `${t('min')}`,
      otherTrainsDptDelay: Math.floor(kpiMemo.localDptDelay / 60) + `${t('min')}`,
      allTrainsDptDelay: Math.floor(kpiMemo.allDptDelay / 60) + `${t('min')}`
    },
    cancellationAfterRescheduling: {
      paidExpressArrDelay:
        Math.floor(kpiMemo.chargeCancel / 60) + `${t('cars')} (` + kpiMemo.chargeParTial + `${t('cars')})`,
      otherTrainsArrDelay:
        Math.floor(kpiMemo.localCancel / 60) + `${t('cars')} (` + kpiMemo.localParTial + `${t('cars')})`,
      allTrainsArrDelay: Math.floor(kpiMemo.allCancel / 60) + `${t('cars')} (` + kpiMemo.allParTial + `${t('cars')})`,
      paidExpressDptDelay: Math.floor(kpiMemo.chargeCanStation / 60) + `${t('stations')} `,
      otherTrainsDptDelay: Math.floor(kpiMemo.localCanStation / 60) + `${t('stations')} `,
      allTrainsDptDelay: Math.floor(kpiMemo.allCanStation / 60) + `${t('stations')} `
    },
    otherApis: {
      paidExpress: '',
      otherTrains: '',
      allTrains: ''
    }
  });
  const [selectedDropdownValue, setSelectedDropdownValue] = useState<number>(-1);
  const [otherKPIList, setOtherKPIList] = useState<OtherKpis>({
    otherKPICode: -1,
    otherKPIValue: [
      t('trainOperationTransitionAdded'),
      t('trainOperationTransitionRemoved'),
      t('splitAdded'),
      t('splitRemoved'),
      t('joinAdded'),
      t('joinRemoved'),
      t('specialAssignmentChanges'),
      t('cumulativeHaltTimeAtOutsideStations'),
      t('arrivalDepartureOrderChanges'),
      t('arrivalDeparturePlatformChanges'),
      t('temporaryTrains'),
      t('durationUntilDelayRestored')
    ]
  });
  const showValueOthersKpiAfterScheduling = (selectedDropdownValue) => {
    if (selectedDropdownValue === t('trainOperationTransitionAdded')) {
      return setFormKpiMemoRef({
        ...formKpiMemoRef,
        otherApis: {
          paidExpress: kpiMemo.chargeLinkset + '',
          otherTrains: kpiMemo.localLinkset + '',
          allTrains: kpiMemo.allLinkset + ''
        }
      });
    } else if (selectedDropdownValue === t('trainOperationTransitionRemoved')) {
      return setFormKpiMemoRef({
        ...formKpiMemoRef,
        otherApis: {
          paidExpress: kpiMemo.chargeLinkcut + '',
          otherTrains: kpiMemo.localLinkcut + '',
          allTrains: kpiMemo.allLinkcut + ''
        }
      });
    } else if (selectedDropdownValue === t('splitAdded')) {
      return setFormKpiMemoRef({
        ...formKpiMemoRef,
        otherApis: {
          paidExpress: kpiMemo.chargeBunkatsu + '',
          otherTrains: kpiMemo.localBunkatsu + '',
          allTrains: kpiMemo.allBunkatsu + ''
        }
      });
    } else if (selectedDropdownValue === t('splitRemoved')) {
      return setFormKpiMemoRef({
        ...formKpiMemoRef,
        otherApis: {
          paidExpress: kpiMemo.chargeCutbunkatsu + '',
          otherTrains: kpiMemo.localCutbunkatsu + '',
          allTrains: kpiMemo.allCutbunkatsu + ''
        }
      });
    } else if (selectedDropdownValue === t('joinAdded')) {
      return setFormKpiMemoRef({
        ...formKpiMemoRef,
        otherApis: {
          paidExpress: kpiMemo.chargeHeigou + '',
          otherTrains: kpiMemo.localHeigou + '',
          allTrains: kpiMemo.allHeigou + ''
        }
      });
    } else if (selectedDropdownValue === t('joinRemoved')) {
      return setFormKpiMemoRef({
        ...formKpiMemoRef,
        otherApis: {
          paidExpress: kpiMemo.chargeCutheigou + '',
          otherTrains: kpiMemo.localCutheigou + '',
          allTrains: kpiMemo.allCutheigou + ''
        }
      });
    } else if (selectedDropdownValue === t('specialAssignmentChanges')) {
      return setFormKpiMemoRef({
        ...formKpiMemoRef,
        otherApis: {
          paidExpress: kpiMemo.chargeToku + '',
          otherTrains: kpiMemo.localToku + '',
          allTrains: kpiMemo.allToku + ''
        }
      });
    } else if (selectedDropdownValue === t('cumulativeHaltTimeAtOutsideStations')) {
      return setFormKpiMemoRef({
        ...formKpiMemoRef,
        otherApis: {
          paidExpress: Math.floor(kpiMemo.chargeStoptime / 60) + t('minute'),
          otherTrains: Math.floor(kpiMemo.localStoptime / 60) + t('minute'),
          allTrains: Math.floor(kpiMemo.allStoptime / 60) + t('minute')
        }
      });
    } else if (selectedDropdownValue === t('arrivalDepartureOrderChanges')) {
      return setFormKpiMemoRef({
        ...formKpiMemoRef,
        otherApis: {
          paidExpress: kpiMemo.chargeSotChange + '',
          otherTrains: kpiMemo.localSotChange + '',
          allTrains: kpiMemo.allSotChange + ''
        }
      });
    } else if (selectedDropdownValue === t('arrivalDeparturePlatformChanges')) {
      return setFormKpiMemoRef({
        ...formKpiMemoRef,
        otherApis: {
          paidExpress: kpiMemo.chargeTrackChange + '',
          otherTrains: kpiMemo.localTrackChange + '',
          allTrains: kpiMemo.allTrackChange + ''
        }
      });
    } else if (selectedDropdownValue === t('temporaryTrains')) {
      return setFormKpiMemoRef({
        ...formKpiMemoRef,
        otherApis: {
          paidExpress: kpiMemo.chargeRinjiTrain + '',
          otherTrains: kpiMemo.localRinjiTrain + '',
          allTrains: kpiMemo.allRinjiTrain + ''
        }
      });
    } else if (selectedDropdownValue === t('durationUntilDelayRestored')) {
      return setFormKpiMemoRef({
        ...formKpiMemoRef,
        otherApis: {
          paidExpress:
            kpiMemo.allRecoverTime !== 0
              ? Math.floor(kpiMemo.chargeRecoverTime / 3600) +
                t('hour') +
                Math.floor(((kpiMemo.chargeRecoverTime / 60) % 60) + 1) +
                t('minute')
              : '-',
          otherTrains:
            kpiMemo.chargeRecoverTime !== 0
              ? Math.floor(kpiMemo.localRecoverTime / 3600) +
                t('hour') +
                Math.floor(((kpiMemo.localRecoverTime / 60) % 60) + 1) +
                t('minute')
              : '-',
          allTrains:
            kpiMemo.localRecoverTime !== 0
              ? Math.floor(kpiMemo.allRecoverTime / 3600) +
                t('hour') +
                Math.floor(((kpiMemo.allRecoverTime / 60) % 60) + 1) +
                t('minute')
              : '-'
        }
      });
    }
  };
  return (
    <div
      style={{
        marginTop: 10,
        placeItems: 'center',
        overflow: 'auto',
        position: 'relative'
      }}>
      <HvGrid container columns="auto" style={{ maxWidth: '400px' }}>
        <HvGrid item xs={12}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('delayBeforeRescheduling')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}></HvGrid>
        <HvGrid item xs={4} style={{ maxWidth: '150px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('arrivalDelay')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ maxWidth: '150px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('departureDelay')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('paidExpress')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.delayBeforeRescheduling.paidExpressArrDelay}
          />
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.delayBeforeRescheduling.paidExpressDptDelay}
          />
        </HvGrid>
        {/* New line */}
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('otherTrains')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.delayBeforeRescheduling.otherTrainsArrDelay}
          />
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.delayBeforeRescheduling.otherTrainsDptDelay}
          />
        </HvGrid>
        {/* New line */}
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('allTrains')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.delayBeforeRescheduling.allTrainsArrDelay}
          />
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.delayBeforeRescheduling.allTrainsDptDelay}
          />
        </HvGrid>
      </HvGrid>

      <HvGrid container columns="auto" style={{ maxWidth: '400px', paddingTop: '16px' }}>
        <HvGrid item xs={12}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('delayAfterRescheduling')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}></HvGrid>
        <HvGrid item xs={4} style={{ maxWidth: '150px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('arrivalDelay')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ maxWidth: '150px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('departureDelay')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('paidExpress')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.delayAfterRescheduling.paidExpressArrDelay}
          />
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.delayAfterRescheduling.paidExpressDptDelay}
          />
        </HvGrid>
        {/* New line */}
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('otherTrains')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.delayAfterRescheduling.otherTrainsArrDelay}
          />
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.delayAfterRescheduling.otherTrainsDptDelay}
          />
        </HvGrid>
        {/* New line */}
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('allTrains')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.delayAfterRescheduling.allTrainsArrDelay}
          />
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.delayAfterRescheduling.allTrainsDptDelay}
          />
        </HvGrid>
      </HvGrid>

      <HvGrid container columns="auto" style={{ maxWidth: '400px', paddingTop: '16px' }}>
        <HvGrid item xs={12}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('cancellationAfterRescheduling')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}></HvGrid>
        <HvGrid item xs={4} style={{ maxWidth: '150px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('partiallyCancelledTrains')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ maxWidth: '150px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('cumulatedStationsThroughWhichCancelledTrainsPass')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('paidExpress')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.cancellationAfterRescheduling.paidExpressArrDelay}
          />
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.cancellationAfterRescheduling.paidExpressDptDelay}
          />
        </HvGrid>
        {/* New line */}
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('otherTrains')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.cancellationAfterRescheduling.otherTrainsArrDelay}
          />
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.cancellationAfterRescheduling.otherTrainsDptDelay}
          />
        </HvGrid>
        {/* New line */}
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('allTrains')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.cancellationAfterRescheduling.allTrainsArrDelay}
          />
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.cancellationAfterRescheduling.allTrainsDptDelay}
          />
        </HvGrid>
      </HvGrid>

      <HvGrid container columns="auto" style={{ maxWidth: '400px', paddingTop: '16px' }}>
        <HvGrid item xs={6} style={{ maxWidth: '200px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('otherKPIsAfterRescheduling')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={6} style={{ maxWidth: '200px' }}>
          <HvDropdown
            style={{ width: '120px' }}
            variableWidth
            aria-label="With search"
            id="drop11"
            onChange={(selected: any) => {
              if (!selected || Array.isArray(selected)) {
                return;
              }
              setSelectedDropdownValue(selected.label);
              showValueOthersKpiAfterScheduling(selected.label);
            }}
            values={otherKPIList.otherKPIValue.map((s) => ({
              label: s,
              selected: s ===  selectedDropdownValue ? true : false
            }))}
          />
        </HvGrid>
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}></HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('paidExpress')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.otherApis.paidExpress}
          />
        </HvGrid>
        {/* New line */}
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}></HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('otherTrains')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.otherApis.otherTrains}
          />
        </HvGrid>
        {/* New line */}
        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}></HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvTypography
            variant="label"
            style={{
              marginLeft: 2,
              marginTop: 5,
              display: 'inline-table'
            }}>
            {t('allTrains')}
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={4} style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}>
          <HvInput
            type="text"
            style={{ width: '120px' }}
            value={formKpiMemoRef.otherApis.allTrains}
          />
        </HvGrid>

        <HvGrid item xs={4} style={{ maxWidth: '100px', paddingTop: '10px' }}></HvGrid>
        <HvGrid
          item
          xs={4}
          style={{ paddingLeft: '0px', maxWidth: '150px', paddingTop: '10px' }}></HvGrid>
        <HvGrid
          item
          xs={4}
          style={{
            paddingLeft: '0px',
            paddingRight: '10px',
            textAlign: 'right',
            paddingTop: '10px',
            marginBottom: '10px'
          }}>
          <HvButton variant="primary" onClick={() => setIsDisplayKpi(false)} >{t('close')}</HvButton>
        </HvGrid>
      </HvGrid>
    </div>
  );
};

export default KpiMonitor;