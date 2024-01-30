import {
  HvButton,
  HvCheckBox,
  HvInput,
  HvRadio,
  HvRadioGroup,
  HvTooltip,
  HvTypography,
  HvVerticalNavigation,
  HvVerticalNavigationHeader,
  HvVerticalNavigationTree
} from '@hitachivantara/uikit-react-core';
import {
  Backwards,
  Calendar,
  Menu,
  Operation,
  Preview,
  Save,
  Search,
  Table,
  Train,
  Trends
} from '@hitachivantara/uikit-react-icons';
import { Close } from '@mui/icons-material';
import TrainIcon from '@mui/icons-material/Train';
import { Box, FormControl, Grid, MenuItem, Select, Typography } from '@mui/material';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/reducers/common.reducer';
import { setIsEditArrivalDeparturePlatformPanelVisible } from '../../redux/reducers/edit-platform.reducer';
import { setTimetableDimension } from '../../redux/reducers/timetable.reducer';
import initializeApi from '../../services/apis/initializeApi';
import timetableApi from '../../services/apis/timetableApi';
import CancelService from './cancel-service/CancelService';
import Chart, { parseDateTime } from './chart/Chart';
import { StayActiveCode, TrainPassOrStopCode } from './chart/types';
import DiaMonitor from './dia-monitor/DiaMonitor';
import './diaManMachine.css';
import ArrivalDeparturePlatform from './edit-platform/ArrivalDeparturePlatform';
import { useEditPlatform } from './edit-platform/hooks/useEditPlatform';
import Edit from './edit/Edit';
import KpiMonitor from './kpi-monitor/KpiMonitor';
import PredictTimeTable from './predict-timetable/PredictTimetable';
import { useCommandInvoker } from './services';
import RemoveTrafficRestriction from './traffic-restriction/RemoveTrafficRestriction';
import TrafficRestriction, { Disruption, Line } from './traffic-restriction/TrafficRestriction';
import VisibleTrain from './visible-train/VisibleTrain';
import useTRANotification from '../../hooks/useNotification';

const fetchData = async (companyName, seqId) => {
  const [stationSequenceResponse, trainRunResponse, trainTypeResponse, passengerFlowResponse] =
    await Promise.all([
      timetableApi.getStationSequence(companyName),
      timetableApi.getTimetableData(companyName),
      timetableApi.getTrainTypeData(companyName),
      timetableApi.getPassengerFlow(companyName)
    ]);
  return {
    stationSequence: stationSequenceResponse.data.find((s) => s.seqId == seqId),
    trainRunData: trainRunResponse.data,
    trainTypeData: trainTypeResponse.data,
    passengerFlowData: passengerFlowResponse.data
  };
};

export default function DiaManMachine() {
  const svgRef = useRef(null);
  const chartRef = useRef();
  const trainsRef = useRef(null);
  const { t } = useTranslation();
  const [openNav, setOpenNav] = useState(false);
  const openNavRef = useRef();
  openNavRef.current = openNav;
  const [panelVisible, setPanelVisible] = useState(false);
  const [navSelected, setNavSelected] = useState('1');
  const navSelectedRef = useRef();
  navSelectedRef.current = navSelected;
  const previousOperationsRef = useRef(null);
  const nextOperationsRef = useRef(null);
  const [openRescheduleForm, setOpenRescheduleForm] = useState(1);
  const openRescheduleFormRef = useRef();
  openRescheduleFormRef.current = openRescheduleForm;
  const [openForeseeForm, setOpenForeseeForm] = useState(1);
  const { companyName } = useSelector((state) => state.timetableReducer);
  const [statePassenger, setStatePassenger] = useState(false);
  const dispatch = useDispatch();
  const { dimension } = useSelector((state) => state.timetableDimensionReducer);
  const { kpiMemo } = useSelector((state) => state.kpiMemoReducer);
  const [timetableData, setTimetableData] = useState();
  const [stations, setStations] = useState([]);
  const [trafficRestrictions, setTrafficRestrictions] = useState([]);
  const trafficRestrictionsStateRef = useRef();
  trafficRestrictionsStateRef.current = trafficRestrictions;
  const [selectedTrainList, setSelectedTrainList] = useState([]);
  const [selectedTrainNo, setSelectedTrainNo] = useState('');
  const selectedTrainNoStateRef = useRef();
  selectedTrainNoStateRef.current = selectedTrainList;
  const trains = trainsRef.current;
  const { time } = useSelector((state) => state.timetableReducer);
  const { simRailRoads } = useSelector((state) => state.railRoadReducer);
  const { sourceTrains } = useSelector((state) => state.trainReducer);
  const { invoker: commandInvoker } = useCommandInvoker();
  const [isDisplayKpi, setIsDisplayKpi] = useState(false);
  const [selectedDisruptionSetting, setDisruptionSetting] = useState(Disruption.SUSPEND);
  const [canceledTrain, setCanceledTrain] = useState();
  const [cancelServiceDataChange, setCancelServiceDataChange] = useState([]);
  const { dispatchEvent: dispatchEditPlatformEvent } = useEditPlatform();
  const { createNotification } = useTRANotification();

  const isEditArrivalDeparturePlatformPanelVisible = useRef();
  isEditArrivalDeparturePlatformPanelVisible.current =
    openNav && navSelected === '1' && openRescheduleForm === 10;
  dispatch(
    setIsEditArrivalDeparturePlatformPanelVisible(
      isEditArrivalDeparturePlatformPanelVisible.current
    )
  );

  useEffect(() => {
    dispatch(setLoading({ state: 'loading', label: 'Preparing Timetable data! Please wait...' }));
    fetchData(companyName, 0).then(
      ({
        stationSequence,
        trainRunData,
        trainTypeData,
        predictedTrainRunData,
        passengerFlowData
      }) => {
        setTimetableData({
          stationSequence,
          trainRunData,
          trainTypeData,
          passengerFlowData,
          predictedTrainRunData
        });
        dispatch(setLoading({ state: 'done' }));
      }
    );
  }, []);

  useEffect(() => {
    const menu = document.getElementById('menu');
    let translateX = 0;
    for (let index = 0; index < menu.children.length; index++) {
      const element = menu.children[index];
      translateX += element.offsetWidth;
    }

    if (chartRef.current && openNav) {
      dispatch(setTimetableDimension({ width: dimension.width - translateX + 50 }));
    }
    if (chartRef.current && !openNav) {
      dispatch(
        setTimetableDimension({
          width: window.innerWidth - dimension.margin.left - dimension.margin.right - 150
        })
      );
    }
    setCanceledTrain(null);
  }, [openNav]);

  const togglePanel = () => {
    setPanelVisible(!panelVisible);
  };

  const closePanel = () => {
    setPanelVisible(false);
  };

  const calculatedDelayTime = (trainRun) => {
    if (trainRun.passOrStopCode === TrainPassOrStopCode.PASS) {
      return (
        parseDateTime(trainRun.simulatedDptTime).getSeconds() -
        parseDateTime(trainRun.plannedDptTime).getSeconds()
      );
    }
    return (
      parseDateTime(trainRun.simulatedArvTime).getSeconds() -
      parseDateTime(trainRun.plannedArvTime).getSeconds()
    );
  };

  const selectedTrainPrevious = () => {
    const previousOperationsValue = previousOperationsRef.current?.textContent;
    trains.forEach((train) => {
      if (train.trainNoName === previousOperationsValue) {
        selectedTrainHandler(train);
        setSelectedTrainNo(train.trainNo.toString());
        d3.selectAll(`g#train-no-${train.trainNo.toString()}`).classed('train-selected', true);
        d3.selectAll(`g#train-no-${selectedTrainNo}`).classed('train-selected', false);
      }
    });
  };

  const selectedTrainNext = () => {
    const nextOperationsValue = nextOperationsRef.current?.textContent;
    trains.forEach((train) => {
      if (train.trainNoName === nextOperationsValue) {
        selectedTrainHandler(train);
        setSelectedTrainNo(train.trainNo.toString());
        d3.selectAll(`g#train-no-${train.trainNo.toString()}`).classed('train-selected', true);
        d3.selectAll(`g#train-no-${selectedTrainNo}`).classed('train-selected', false);
      }
    });
  };

  const selectedTrainHandler = (train, e) => {
    if (
      openNavRef.current &&
      navSelectedRef.current === '1' &&
      openRescheduleFormRef.current === 1
    ) {
      setCanceledTrain(train);
    } else if (isEditArrivalDeparturePlatformPanelVisible.current) {
      dispatchEditPlatformEvent(e, 'TRAIN_LINE');
    } else {
      setPanelVisible(true);
      if (selectedTrainNoStateRef.current.find((t) => t.trainNo === train.trainNo)) {
        setSelectedTrainNo(train.trainNo.toString());
      } else {
        const selectedTrain = {
          ...train,
          trackCode: train.planedTrackCode, //This is the hardcode, the actual value will be calculated in the future.
          trackName: '', //This is the hardcode, the actual value will be calculated in the future.
          jyunpoFg: false //This is the hardcode, the actual value will be calculated in the future.
        };
        selectedTrain.previousOperations = '';
        selectedTrain.nextOperations = '';
        selectedTrain.mainShuntFlag = null;
        selectedTrain.trainTypeName = '';
        const startTimeHour = time.hour < 10 ? '0' + time.hour : time.hour.toString();
        const startTimeMinute = time.minute < 10 ? '0' + time.minute : time.minute.toString();
        const startTime = startTimeHour + ':' + startTimeMinute + ':00';
        let exArvTime = '';
        let timeRangeStart = '';
        if (trafficRestrictionsStateRef.current.length > 0) {
          exArvTime = calculateExArvTime();
          timeRangeStart = calculateTimeRangeStartOfUnavailableRailroad();
        }

        timetableData.trainRunData.trainQ.forEach((train) => {
          if (
            train.trainRunList.at(-1).linkTrainPoint ===
            selectedTrain.trainRunList[0].frontLinkTrainQ[0]
          ) {
            selectedTrain.previousOperations = train.trainNoName;
          }

          if (
            train.trainRunList[0].linkTrainPoint ===
            selectedTrain.trainRunList.at(-1).backLinkTrainQ[0]
          ) {
            selectedTrain.nextOperations = train.trainNoName;
          }
          if (train.trainNo === selectedTrain.trainNo) {
            let lastStationCodeOnChart = 0;
            selectedTrain.trainRunList.forEach((trainRun) => {
              const station = timetableData.stationSequence.stationList.find(
                (station) => station.stationCode === trainRun.stationCode
              );
              if (station) {
                lastStationCodeOnChart = station.stationCode;
              }
            });
            selectedTrain.mainShuntFlag = train.mainShuntFlag;
            selectedTrain.trainRunList.forEach((selectedTrainRun, index) => {
              selectedTrainRun.trainType = index === 0 ? train.trainRunList[0].trainType : null;
              selectedTrainRun.arvRailCode = train.trainRunList[index].arvRailCode;
              selectedTrainRun.dptRailCode = train.trainRunList[index].dptRailCode;
              selectedTrainRun.tokuhatsuFg = train.trainRunList[index].tokuhatsuFg;
              selectedTrainRun.delayTime =
                index === 0 ? null : calculatedDelayTime(selectedTrainRun);
              selectedTrainRun.bothN = train.trainRunList[index].bothN;
              selectedTrainRun.stationName = '';
              selectedTrainRun.plannedTrackName = '';
              const selectedTrainRunStation = timetableData.trainRunData.diaStationQ.find(
                (station) => station.stationCode === selectedTrainRun.stationCode
              );
              if (selectedTrainRunStation) {
                selectedTrainRun.stationName = selectedTrainRunStation.stationName;
                selectedTrainRun.plannedTrackName = selectedTrainRunStation.trackList.find(
                  (track) => track.trackCode === selectedTrainRun.plannedTrackCode
                ).trackName;
              }

              calculateTimeSpecified(
                exArvTime,
                timeRangeStart,
                selectedTrainRun,
                lastStationCodeOnChart
              );

              const resultedArvFlag = train.trainRunList[index].resultedArvFlag;
              const resultedDptFlag = train.trainRunList[index].resultedDptFlag;
              calculateFinishedOrCancelled(
                startTime,
                resultedArvFlag,
                resultedDptFlag,
                selectedTrain,
                selectedTrainRun,
                index
              );

              if (selectedTrain.mainShuntFlag === 0) {
                calculateLine(selectedTrain, selectedTrainRun, index);
              }

              calculateOrder(selectedTrain, selectedTrainRun, index);
            });
          }
        });
        timetableData.trainTypeData.forEach((type) => {
          if (type.trainTypeCode === selectedTrain.trainRunList[0].trainType) {
            selectedTrain.trainTypeName = type.trainTypeName;
          }
        });
        setSelectedTrainList((list) => [...list, selectedTrain]);
        setSelectedTrainNo(selectedTrain.trainNo.toString());
        if (!panelVisible) togglePanel();
      }
    }
  };

  function calculateExArvTime() {
    const exArvTimeHourNum = trafficRestrictionsStateRef.current.at(-1).timeRange.end.hour;
    const exArvTimeMinuteNum = trafficRestrictionsStateRef.current.at(-1).timeRange.end.minute;
    if ((exArvTimeHourNum === 0 || exArvTimeHourNum === 24) && exArvTimeMinuteNum === 0) {
      return '';
    }
    const exArvTimeHour =
      exArvTimeHourNum < 10 ? '0' + exArvTimeHourNum : exArvTimeHourNum.toString();
    const exArvTimeMinute =
      exArvTimeMinuteNum < 10 ? '0' + exArvTimeMinuteNum : exArvTimeMinuteNum.toString();
    const exArvTime = exArvTimeHour + ':' + exArvTimeMinute + ':00';
    return exArvTime;
  }

  function calculateTimeRangeStartOfUnavailableRailroad() {
    const timeRangeStartHourNum = trafficRestrictionsStateRef.current.at(-1).timeRange.start.hour;
    const timeRangeStartHour =
      timeRangeStartHourNum < 10 ? '0' + timeRangeStartHourNum : timeRangeStartHourNum.toString();
    const timeRangeStartMinuteNum =
      trafficRestrictionsStateRef.current.at(-1).timeRange.start.minute;
    const timeRangeStartMinute =
      timeRangeStartMinuteNum < 10
        ? '0' + timeRangeStartMinuteNum
        : timeRangeStartMinuteNum.toString();
    const timeRangeStart = timeRangeStartHour + ':' + timeRangeStartMinute + ':00';
    return timeRangeStart;
  }

  function calculateTimeSpecified(exArvTime, timeRangeStart, trainRun, lastStationCodeOnChart) {
    if (
      exArvTime === '' ||
      trainRun.passOrStopCode !== TrainPassOrStopCode.STOP ||
      trainRun.plannedArvTime < timeRangeStart ||
      trainRun.plannedArvTime === exArvTime ||
      trafficRestrictionsStateRef.current.at(-1).stationRange.start >= trainRun.stationCode ||
      trafficRestrictionsStateRef.current.at(-1).stationRange.end < trainRun.stationCode
    ) {
      trainRun.arvTimeSpecified = '';
    } else {
      trainRun.arvTimeSpecified = exArvTime;
    }

    if (
      exArvTime === '' ||
      trainRun.stationCode >= lastStationCodeOnChart ||
      trainRun.plannedDptTime < timeRangeStart ||
      trainRun.plannedDptTime === exArvTime ||
      trafficRestrictionsStateRef.current.at(-1).stationRange.start > trainRun.stationCode ||
      trafficRestrictionsStateRef.current.at(-1).stationRange.end <= trainRun.stationCode
    ) {
      trainRun.dptTimeSpecified = '';
    } else {
      trainRun.dptTimeSpecified = exArvTime;
    }
  }

  function calculateFinishedOrCancelled(
    startTime,
    resultedArvFlag,
    resultedDptFlag,
    train,
    trainRun,
    index
  ) {
    if (
      (index > 0 && trainRun.plannedArvTime < startTime) ||
      (trainRun.passOrStopCode === TrainPassOrStopCode.PASS && trainRun.plannedDptTime < startTime)
    ) {
      resultedArvFlag = 1;
    }
    if (resultedArvFlag === 1) {
      trainRun.ArvfinishedOrCancelled = '済';
    } else if (train.trainRunList[index].arvStayActiveCode === StayActiveCode.STAY) {
      trainRun.ArvfinishedOrCancelled = '休';
    } else if (train.jyunpoFg) {
      trainRun.ArvfinishedOrCancelled = '保';
    } else {
      trainRun.ArvfinishedOrCancelled = '';
    }

    if (index < train.trainRunList.length - 1 && trainRun.plannedDptTime < startTime) {
      resultedDptFlag = 1;
    }
    if (resultedDptFlag === 1) {
      trainRun.DptfinishedOrCancelled = '済';
    } else if (train.trainRunList[index].dptStayActiveCode === StayActiveCode.STAY) {
      trainRun.DptfinishedOrCancelled = '休';
    } else {
      trainRun.DptfinishedOrCancelled = '';
    }
  }

  function calculateLine(train, trainRun, index) {
    const arvRailRoad = simRailRoads.find((r) => r.railCode === trainRun.arvRailCode);
    trainRun.lineArrival = arvRailRoad && index !== 0 ? arvRailRoad.railName : '';

    const dptRailRoad = simRailRoads.find((r) => r.railCode === trainRun.dptRailCode);
    trainRun.lineDeparture =
      dptRailRoad && index !== train.trainRunList.length - 1 ? dptRailRoad.railName : '';
  }

  function calculateOrder(selectedTrain, selectedTrainRun, index) {
    selectedTrainRun.arrivalOrder =
      index > 0 ? selectedTrain.trainRunList[index - 1].departureOrder : null;
    selectedTrainRun.departureOrder = index < selectedTrain.trainRunList.length - 1 ? 0 : null;
    if (selectedTrain.mainShuntFlag === 0 && selectedTrainRun.departureOrder !== null) {
      timetableData.trainRunData.trainQ.forEach((train) => {
        train.trainRunList.forEach((trainRun) => {
          if (selectedTrainRun.arrivalOrder !== null)
            selectedTrainRun.arrivalOrder = selectedTrain.trainRunList[index - 1].departureOrder;
          if (
            trainRun.runSequence !== train.trainRunList.length - 1 &&
            trainRun.upDownCode === selectedTrainRun.upDownCode &&
            trainRun.dptRailCode === selectedTrainRun.dptRailCode &&
            trainRun.stationCode === selectedTrainRun.stationCode &&
            train.trainRunList[trainRun.runSequence + 1].stationCode ===
              selectedTrain.trainRunList[index + 1].stationCode &&
            trainRun.plannedDptTime < selectedTrainRun.plannedDptTime
          ) {
            selectedTrainRun.departureOrder = selectedTrainRun.departureOrder + 1;
          }
        });
      });
    }
  }

  const handleChangeTab = (event, value) => {
    if (event.target.role === 'tab') {
      d3.select(svgRef.current)
        .selectAll('.train-line-group.train-selected')
        .classed('train-selected', false);
      setSelectedTrainNo(value);
      d3.selectAll(`g#train-no-${value}`).classed('train-selected', true);
    }
  };

  const handleCloseTab = (value) => {
    if (selectedTrainList.length === 1) {
      closePanel();
      setSelectedTrainList([]);
      setSelectedTrainNo('');
      d3.selectAll(`g#train-no-${value}`).classed('train-selected', false);
    } else {
      if (value === Number(selectedTrainNo)) {
        if (value === selectedTrainList[0].trainNo) {
          setSelectedTrainNo(selectedTrainList[1].trainNo.toString());
          d3.selectAll(`g#train-no-${value}`).classed('train-selected', false);
          d3.selectAll(`g#train-no-${selectedTrainList[1].trainNo.toString()}`).classed(
            'train-selected',
            true
          );
        } else {
          const index = selectedTrainList.findIndex((t) => t.trainNo === value);
          setSelectedTrainNo(selectedTrainList[index - 1].trainNo.toString());
          d3.selectAll(`g#train-no-${value}`).classed('train-selected', false);
          d3.selectAll(`g#train-no-${selectedTrainList[index - 1].trainNo.toString()}`).classed(
            'train-selected',
            true
          );
        }
      }
      const newSelectedTrainList = selectedTrainList.filter((t) => t.trainNo !== value);
      setSelectedTrainList(newSelectedTrainList);
    }
  };
  const mainRef = useRef(null);
  const getDataTrafficRestriction = async () => {
    const dataInitialize = (await initializeApi.getInitialize()).data;
    const formData = {
      railCompany: dataInitialize.companies[0].railCompany,
      railRoads: dataInitialize.companies[0].railroads.map((item) => {
        return {
          railroadSectionCode: item.railroadSectionCode,
          railroadSectionName: item.railroadSectionName
        };
      }),
      trainRun: cancelServiceDataChange[0],
      trainRunOperation: cancelServiceDataChange[0],
    };
    if (trafficRestrictions.length !== 0) {
      return {
        ...formData,
        trafficRestriction: [
          ...trafficRestrictions.map((traffic) => {
            const { start, end } = traffic.timeRange;
            const predictData = {
              type: traffic.disruption,
              trackCode: traffic.line === 'local' ? Line.LOCAL : Line.EXPRESS,
              startedStation: traffic.stationRange.start,
              endedStation: traffic.stationRange.end,
              line: Number(traffic.direction),
              startedTime: start.hour * 3600 + start.minute * 60,
              finishedTime: end.hour * 3600 + end.minute * 60
            };
            if (traffic.disruption === Disruption.SLOW_DOWN) {
              return {
                ...predictData,
                speed: traffic.speed
              };
            }
            return {
              ...predictData,
              speed: 0
            };
          })
        ]
      };
    }
    return formData;
  };
  const onClickSaveReplayInfo = async () => {
    dispatch(setLoading({ state: 'loading', label: 'Saving Timetable data! Please wait...' }));
    try {
      const formData = await getDataTrafficRestriction();
      const { data } = await timetableApi.getOutputTimetable(companyName, JSON.stringify(formData));
      createNotification(data.message || 'Action successfully!', { variant: 'success' });
    } catch (e) {
      console.error(e);
      createNotification('Save Replay failed!', { variant: 'error' });
    } finally {
      dispatch(setLoading({ state: 'done' }));
    }
  };
  const showTotalDelayTimeValue = (allDptDelay) => {
    let sg = '';
    if (allDptDelay !== 0) {
      Math.floor(allDptDelay / 60) > 0 ? (sg = '+') : (sg = '');
    }
    return (
      Math.floor(allDptDelay / 60) +
      `${t('min')} (` +
      sg +
      Math.floor(allDptDelay / 60) +
      `${t('min')})`
    );
  };

  useEffect(() => {
    d3.select(svgRef.current).on('click', (e) => {
      if (e.srcElement.nodeName === 'svg' && !isEditArrivalDeparturePlatformPanelVisible.current) {
        closePanel();
        setOpenNav(false);
      }
    });
  }, [svgRef.current]);

  useEffect(() => {
    d3.select(svgRef.current).attr(
      'openning-panel',
      String(isEditArrivalDeparturePlatformPanelVisible.current)
    );
  }, [isEditArrivalDeparturePlatformPanelVisible.current]);

  return (
    <div ref={mainRef}>
      <Box height="100%" display="flex" className="styleBox">
        <Grid item autoWidth>
          <Grid
            autoWidth
            container
            id={'menu'}
            style={{
              display: 'inline-flex',
              position: 'relative',
              flexWrap: 'nowrap',
              height: '100%'
            }}
            className={openNav && navSelected ? 'menu-float' : ''}>
            <Grid item minHeight={window.innerHeight} height="100%" display="flex">
              <HvVerticalNavigation open={openNav} useIcons={true}>
                <HvVerticalNavigationHeader
                  collapseButtonProps={{
                    'aria-expanded': true,
                    'aria-label': 'collapseButton'
                  }}
                  onCollapseButtonClick={() => setOpenNav((openNav) => !openNav)}
                  title="Menu"
                  openIcon={<Menu />}
                  closeIcon={<Backwards />}
                />
                <HvVerticalNavigationTree
                  aria-label="Example 3 navigation"
                  collapsible
                  data={[
                    {
                      icon: <Calendar />,
                      id: '1',
                      label: t('reschedule')
                    },
                    {
                      icon: <Preview />,
                      id: '9',
                      label: t('foresee')
                    },
                    {
                      icon: <Table />,
                      id: '8',
                      label: t('predictTimetable')
                    },
                    {
                      icon: <Operation />,
                      id: '2',
                      label: t('autoReschedule')
                    },
                    {
                      icon: <Search />,
                      id: '3',
                      label: t('searchTrain')
                    },
                    {
                      icon: <Save />,
                      id: '4',
                      label: t('save')
                    },
                    {
                      icon: <Trends />,
                      id: '5',
                      label: 'KPI'
                    },
                    {
                      icon: <Train />,
                      id: '7',
                      label: t('visibleTrains')
                    }
                  ]}
                  defaultExpanded={false}
                  onChange={(event, page) => {
                    setNavSelected(page.id);
                    if (openNav === false) setOpenNav(true);
                  }}
                  selected={navSelected}
                />
                <Edit
                  stations={stations}
                  setTrafficRestrictions={setTrafficRestrictions}
                  commandInvoker={commandInvoker}
                />
              </HvVerticalNavigation>
            </Grid>

            {openNav && navSelected === '1' && (
              <Grid item sx={{ bgcolor: '#FBFCFD', paddingTop: 3, paddingRight: '2px' }}>
                <div>
                  <FormControl style={{ width: 300 }}>
                    <Select
                      value={openRescheduleForm}
                      onChange={(e) => setOpenRescheduleForm(e.target.value)}>
                      <MenuItem value={1}>
                        <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                          {t('cancelService')}
                        </HvTypography>
                      </MenuItem>
                      <MenuItem value={2}>
                        <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                          {t('stopPass')}
                        </HvTypography>
                      </MenuItem>
                      <MenuItem value={3}>
                        <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                          {t('turnAround')}
                        </HvTypography>
                      </MenuItem>
                      <MenuItem value={4}>
                        <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                          {t('specialAssignmentChange')}
                        </HvTypography>
                      </MenuItem>
                      <MenuItem value={5}>
                        <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                          {t('split')}
                        </HvTypography>
                      </MenuItem>
                      <MenuItem value={6}>
                        <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                          {t('join')}
                        </HvTypography>
                      </MenuItem>
                      <MenuItem value={7}>
                        <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                          {t('temporaryTrain')}
                        </HvTypography>
                      </MenuItem>
                      <MenuItem value={8}>
                        <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                          {t('temporaryShunting')}
                        </HvTypography>
                      </MenuItem>
                      <MenuItem value={9}>
                        <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                          {t('arrivalDepartureOrder')}
                        </HvTypography>
                      </MenuItem>
                      <MenuItem value={10}>
                        <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                          {t('arrivalDeparturePlatform')}
                        </HvTypography>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                {openNav && navSelected === '1' && openRescheduleForm === 1 && (
                  <CancelService
                    canceledTrain={canceledTrain}
                    stations={timetableData.trainRunData.diaStationQ}
                    trainTypeData={timetableData.trainTypeData}
                    svgRef={svgRef}
                    setCancelServiceDataChange={setCancelServiceDataChange}
                    commandInvoker={commandInvoker}
                    setOpenNav={setOpenNav}
                  />
                )}
                {openNav && navSelected === '1' && openRescheduleForm === 10 && (
                  <ArrivalDeparturePlatform
                    trainTypeData={timetableData.trainTypeData}
                    commandInvoker={commandInvoker}
                    setOpenNav={setOpenNav}
                  />
                )}
              </Grid>
            )}

            {openNav && navSelected === '9' && (
              <Grid item sx={{ bgcolor: '#FBFCFD', paddingTop: 3, paddingRight: '2px' }}>
                <div>
                  <FormControl style={{ width: 300 }}>
                    <Select
                      value={openForeseeForm}
                      onChange={(e) => setOpenForeseeForm(e.target.value)}>
                      <MenuItem value={1}>
                        <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                          {t('setDelayPresumption')}
                        </HvTypography>
                      </MenuItem>
                      <MenuItem value={2}>
                        <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                          {t('setUnavailableRailroad')}
                        </HvTypography>
                      </MenuItem>
                      <MenuItem value={3}>
                        <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                          {t('removeUnavailableRailroad')}
                        </HvTypography>
                      </MenuItem>
                      <MenuItem value={4}>
                        <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                          {t('resetRescheduling')}
                        </HvTypography>
                      </MenuItem>
                      <MenuItem value={5}>
                        <HvTooltip
                          placement="right"
                          title={t('setUnavailableRailroadExternalLine')}>
                          <HvTypography style={{ width: 250 }} variant="title4" noWrap="false">
                            {t('setUnavailableRailroadExternalLine')}
                          </HvTypography>
                        </HvTooltip>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                {openNav && navSelected === '9' && openForeseeForm === 2 && (
                  <TrafficRestriction
                    setOpenNav={setOpenNav}
                    stations={stations}
                    trafficRestrictions={trafficRestrictions}
                    setTrafficRestrictions={setTrafficRestrictions}
                    commandInvoker={commandInvoker}
                  />
                )}
                {openNav && navSelected === '9' && openForeseeForm === 3 && (
                  <RemoveTrafficRestriction
                    setOpenNav={setOpenNav}
                    stations={stations}
                    trafficRestrictions={trafficRestrictions}
                    setTrafficRestrictions={setTrafficRestrictions}
                    commandInvoker={commandInvoker}
                  />
                )}
              </Grid>
            )}

            {openNav && navSelected === '2' && (
              <Grid item sx={{ bgcolor: '#FBFCFD', paddingTop: 3, paddingRight: '2px' }}>
                <div className="rowTabPanel">
                  <HvButton variant="primary"> AI_start </HvButton>
                  <HvButton variant="primary"> AI_stop </HvButton>
                  <HvButton variant="primary"> {t('execute')} </HvButton>
                </div>
                <div className="rowTabPanel">
                  <HvButton variant="primary"> {t('visualizeReschedulingProcess')} </HvButton>
                </div>
                <div className="rowTabPanel">
                  <HvInput
                    type="text"
                    style={{
                      width: 50,
                      height: 25,
                      marginTop: 5,
                      marginLeft: 2
                    }}
                  />
                  <Typography
                    style={{ marginLeft: 5, marginTop: 5, display: 'inline-table' }}
                    noWrap>
                    {t('stepsCompleted')}
                  </Typography>
                </div>
                <div className="rowTabPanel">
                  <HvInput
                    type="text"
                    style={{
                      width: 150,
                      height: 25,
                      marginTop: 5,
                      marginLeft: 2
                    }}
                  />
                </div>
                <div className="rowTabPanel">
                  <HvCheckBox defaultChecked label={t('changeArrivalDepartureOrder')} />
                </div>
                <div className="rowTabPanel">
                  <HvCheckBox defaultChecked label={t('changeArrivalDeparturePlatform')} />
                </div>
                <div className="rowTabPanel">
                  <HvCheckBox defaultChecked label={t('cancelService')} />
                  <HvCheckBox defaultChecked label={t('changeTrainOperation')} />
                </div>
                <div className="rowTabPanel">
                  <HvCheckBox style={{ marginLeft: 1 }} label="auto" />
                  <HvButton variant="primary"> {t('compare')} </HvButton>
                  <HvCheckBox defaultChecked style={{ marginLeft: 8 }} label="運用制約" />
                </div>
              </Grid>
            )}

            {openNav && navSelected === '3' && (
              <Grid item sx={{ bgcolor: '#FBFCFD', paddingTop: 3, paddingRight: '2px' }}>
                <div className="rowTabPanel">
                  <HvInput
                    type="text"
                    style={{
                      width: 150,
                      height: 25,
                      marginTop: 5,
                      marginLeft: 2
                    }}
                  />
                  <HvInput
                    type="text"
                    style={{
                      width: 50,
                      height: 25,
                      marginTop: 5,
                      marginLeft: 5
                    }}
                  />
                  <HvButton variant="primary" style={{ marginLeft: 10 }}>
                    {' '}
                    {t('display')}{' '}
                  </HvButton>
                </div>
                <div className="rowTabPanel">
                  <HvRadioGroup>
                    <HvRadio checked label={t('trainNumber')} value={t('trainNumber')} />
                    <HvRadio label={t('internalTrainNumber')} value={t('internalTrainNumber')} />
                  </HvRadioGroup>
                </div>
              </Grid>
            )}

            {openNav && navSelected === '4' && (
              <Grid item sx={{ bgcolor: '#FBFCFD', paddingTop: 3, paddingRight: '2px' }}>
                <div className="rowTabPanel">
                  <HvButton variant="primary" onClick={onClickSaveReplayInfo}>
                    {' '}
                    {t('saveReplayInfo')}{' '}
                  </HvButton>
                  <HvButton variant="primary"> {t('saveNetworkInfo')} </HvButton>
                </div>
              </Grid>
            )}
            {openNav && navSelected === '5' && (
              <Grid item sx={{ bgcolor: '#FBFCFD', paddingTop: 3, paddingRight: '2px' }}>
                <div className="rowTabPanel" style={{ marginLeft: 2 }}>
                  <div>
                    <HvTypography noWrap="true">{t('totalDelayTime')}</HvTypography>
                    <HvInput type="text" value={showTotalDelayTimeValue(kpiMemo.allDptDelay)} />
                  </div>
                </div>
                <div className="rowTabPanel" style={{ marginLeft: 2, marginTop: 10 }}>
                  <div>
                    <HvTypography noWrap="true">
                      {t('totalDelayTimePaidLimitedExpress')}
                    </HvTypography>
                    <HvInput type="text" value={showTotalDelayTimeValue(kpiMemo.chargeDptDelay)} />
                  </div>
                </div>
                <div className="rowTabPanel" style={{ marginLeft: 2, marginTop: 10 }}>
                  <HvButton variant="primary" onClick={() => setIsDisplayKpi(true)}>
                    {t('displayKPI')}
                  </HvButton>
                </div>
                {isDisplayKpi && <KpiMonitor setIsDisplayKpi={setIsDisplayKpi} />}
              </Grid>
            )}
            {/* {openNav && navSelected === '' && <VisibleTrain />} */}
            {openNav && navSelected === '7' && <VisibleTrain stations={stations} svgRef={svgRef} />}
            {openNav && navSelected === '8' && (
              <PredictTimeTable
                stations={stations}
                getDataTrafficRestriction={getDataTrafficRestriction}
              />
            )}
          </Grid>
        </Grid>
        {timetableData && timetableData.stationSequence.length !== 0 ? (
          <div style={{ display: 'flex', flexGrow: 1 }} ref={chartRef}>
            <Chart
              trafficRestrictions={trafficRestrictions}
              svgRef={svgRef}
              timetableData={timetableData}
              stations={stations}
              setStations={setStations}
              selectedTrainHandler={selectedTrainHandler}
              trainsRef={trainsRef}
              selectedTrainList={selectedTrainList}
              selectedTrainNo={Number(selectedTrainNo)}
            />
          </div>
        ) : null}
      </Box>
      {panelVisible && (
        <>
          <DiaMonitor
            selectedTrainList={selectedTrainList}
            selectedTrainNo={selectedTrainNo}
            handleChangeTab={handleChangeTab}
            handleCloseTab={handleCloseTab}
            selectedTrainPrevious={selectedTrainPrevious}
            selectedTrainNext={selectedTrainNext}
            previousOperationsRef={previousOperationsRef}
            nextOperationsRef={nextOperationsRef}
            mainRef={mainRef}
          />
          <div className="panel-icon panel-icon-show">
            <HvButton
              variant="primaryGhost"
              endIcon={<Close />}
              className="button_time"
              onClick={togglePanel}
            />
          </div>
        </>
      )}
      {!panelVisible && (
        <div className="panel-icon panel-icon-show">
          <HvButton
            variant="primaryGhost"
            endIcon={<Close />}
            className="button_time"
            onClick={togglePanel}
          />
        </div>
      )}
      {!panelVisible && (
        <div className="panel-icon panel-icon-show">
          <HvButton
            variant="primaryGhost"
            endIcon={<TrainIcon />}
            className="button_time"
            onClick={togglePanel}
          />
        </div>
      )}
    </div>
  );
}
