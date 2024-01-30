import { HvButton, HvTypography } from '@hitachivantara/uikit-react-core';
import { Close } from '@hitachivantara/uikit-react-icons';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Menu,
  MenuItem,
  MenuProps,
  Paper,
  Tab,
  Typography,
  alpha,
  styled
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Rnd } from 'react-rnd';
import { TrainData, TrainPassOrStopCode } from '../chart/types';
import './diaMonitor.css';
import TimeTable from './time-table/TimeTable';

type DiaMonitorProps = {
  onClose: any;
  trainData: TrainData;
  keyTab: number;
  idTab: number;
  addTab: () => void;
  tabs: any[];
  selectedTab: string;
  createNewTab: () => void;
  handleTabClose: (e, value) => void;
  handleChange: (event, newValue) => void;
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function DiaMonitor({
  selectedTrainList,
  selectedTrainNo,
  handleChangeTab,
  handleCloseTab,
  selectedTrainPrevious,
  selectedTrainNext,
  previousOperationsRef,
  nextOperationsRef,
  mainRef
}) {
  const [subValue, setSubValue] = useState('1');
  const [timeTableColumns, setTimeTableColumns] = useState([
    { name: 'actualForecast', isActive: true },
    { name: 'delay', isActive: true },
    { name: 'timeSpecified', isActive: true },
    { name: 'platform', isActive: true },
    { name: 'arrivalDepartureOrder', isActive: true },
    { name: 'line', isActive: true },
    { name: 'operationT', isActive: true },
    { name: 'specialAssignmentChange', isActive: true },
    { name: 'finishedCancelled', isActive: true },
    { name: 'rollingStocks', isActive: true }
  ]);
  const [isShowAllTableColumns, setIsShowAllTableColumns] = useState(true);

  const { t } = useTranslation();

  const handleChangeSubValue = (event: React.SyntheticEvent, newValue: string) => {
    setSubValue(newValue);
  };
  const [hasValue, setHasValue] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const checkBoxHandler = (index: number, value) => {
    timeTableColumns[index].isActive = !value;
    const count = timeTableColumns.filter((column) => column.isActive === true).length;
    if (value) {
      if (isShowAllTableColumns) {
        setIsShowAllTableColumns(false);
      }
    } else {
      if (count === timeTableColumns.length) {
        setIsShowAllTableColumns(true);
      }
    }
    setTimeTableColumns([...timeTableColumns]);
  };
  const checkBoxAllHandler = () => {
    if (isShowAllTableColumns) {
      timeTableColumns.forEach((column) => {
        column.isActive = false;
      });
    } else {
      timeTableColumns.forEach((column) => {
        column.isActive = true;
      });
    }
    setTimeTableColumns(timeTableColumns);
    setIsShowAllTableColumns(!isShowAllTableColumns);
  };

  const widthPanel = (mainRef.current.offsetWidth * 55) / 100;
  const heightPanel = mainRef.current.offsetHeight;
  const x = mainRef.current.offsetWidth - widthPanel + 32;

  return (
    <Rnd
      style={{
        background: 'white',
        padding: '0px 0px 15px 15px',
        overflow: 'auto'
      }}
      default={{
        x: x,
        y: 0,
        width: widthPanel,
        height: heightPanel
      }}
      enableResizing={{ left: true }}
      disableDragging={true}>
      {selectedTrainList.length === 0 ? (
        <div>{t('diaMonitorNoTab')}</div>
      ) : (
        <TabContext value={selectedTrainNo}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
            <TabList
              onChange={handleChangeTab}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons={true}>
              {selectedTrainList.map((train) => (
                <Tab
                  key={train.trainNo.toString()}
                  label={train.trainNoName}
                  value={train.trainNo.toString()}
                  sx={{ textTransform: 'none' }}
                  icon={
                    <Close onClick={(e) => handleCloseTab(train.trainNo)} className="close-icon" />
                  }
                  iconPosition="end"
                />
              ))}
            </TabList>
          </Box>
          {selectedTrainList.map((train) => (
            <TabPanel value={train.trainNo.toString()}>
              <TabContext value={subValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '20px' }}>
                  <TabList
                    onChange={handleChangeSubValue}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons={false}>
                    <Tab
                      label={t('trainInformation')}
                      sx={{ textTransform: 'none' }}
                      value="1"
                      style={{ display: 'block' }}
                    />
                    <Tab
                      label={t('timetable')}
                      sx={{ textTransform: 'none' }}
                      value="2"
                      style={{ display: 'block' }}
                    />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <Box sx={{ display: 'block' }}>
                    <Grid container columns={12} className={'train-info-item'}>
                      <Grid item xs={6}>
                        <Grid container columns={6}>
                          <Grid item xs={3}>
                            <HvTypography variant="label" className={'dia-monitor-label'}>
                              {t('trainNumber')}
                            </HvTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <HvTypography className={'dia-monitor-label'}>
                              {train.trainNoName}
                            </HvTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container columns={12} className={'train-info-item'}>
                      <Grid item xs={6}>
                        <Grid container columns={6}>
                          <Grid item xs={3}>
                            <HvTypography variant="label" className={'dia-monitor-label'}>
                              {t('internalTrainID')}
                            </HvTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <HvTypography className={'dia-monitor-label'}>
                              {train.trainNo}
                            </HvTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container columns={12} className={'train-info-item'}>
                      <Grid item xs={6}>
                        <Grid container columns={6}>
                          <Grid item xs={3}>
                            <HvTypography variant="label" className={'dia-monitor-label'}>
                              {t('startingStation')}
                            </HvTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <HvTypography className={'dia-monitor-label'}>
                              {train.trainRunList[0].stationName}
                            </HvTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container columns={12} className={'train-info-item'}>
                      <Grid item xs={6}>
                        <Grid container columns={6}>
                          <Grid item xs={3}>
                            <HvTypography
                              variant="label"
                              className={'dia-monitor-label'}
                              style={{ marginRight: '35px' }}>
                              {t('terminalStation')}
                            </HvTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <HvTypography className={'dia-monitor-label'}>
                              {train.trainRunList.at(-1).stationName}
                            </HvTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container columns={12} className={'train-info-item'} alignItems="center">
                      <Grid item xs={6}>
                        <Grid container columns={6}>
                          <Grid item xs={3}>
                            <HvTypography variant="label" className={'dia-monitor-label'}>
                              {t('previousOperations')}
                            </HvTypography>
                          </Grid>
                          <Grid item xs={3}>
                            {train.previousOperations ? (
                              <HvTypography
                                className={'dia-monitor-label'}
                                ref={previousOperationsRef}>
                                {train.previousOperations}
                              </HvTypography>
                            ) : (
                              <HvTypography className={'dia-monitor-label'}>
                                {t('none')}
                              </HvTypography>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        {train.previousOperations ? (
                          <HvButton
                            variant="primary"
                            className={'dia-monitor-button'}
                            onClick={selectedTrainPrevious}>
                            {' '}
                            {t('show')}{' '}
                          </HvButton>
                        ) : (
                          <HvButton variant="primary" className={'dia-monitor-button'} disabled>
                            {' '}
                            {t('show')}{' '}
                          </HvButton>
                        )}
                      </Grid>
                    </Grid>
                    <Grid container columns={12} className={'train-info-item'} alignItems="center">
                      <Grid item xs={6}>
                        <Grid container columns={6}>
                          <Grid item xs={3}>
                            <HvTypography variant="label" className={'dia-monitor-label'}>
                              {t('nextOperations')}
                            </HvTypography>
                          </Grid>
                          <Grid item xs={3}>
                            {train.nextOperations ? (
                              <HvTypography className={'dia-monitor-label'} ref={nextOperationsRef}>
                                {train.nextOperations}
                              </HvTypography>
                            ) : (
                              <HvTypography className={'dia-monitor-label'}>
                                {t('none')}
                              </HvTypography>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        {train.nextOperations ? (
                          <HvButton
                            variant="primary"
                            className={'dia-monitor-button'}
                            onClick={selectedTrainNext}>
                            {' '}
                            {t('show')}{' '}
                          </HvButton>
                        ) : (
                          <HvButton variant="primary" className={'dia-monitor-button'} disabled>
                            {' '}
                            {t('show')}{' '}
                          </HvButton>
                        )}
                      </Grid>
                    </Grid>
                    <Grid container columns={12} className={'train-info-item'} alignItems="center">
                      <Grid item xs={6}>
                        <Grid container columns={6}>
                          <Grid item xs={3}>
                            <HvTypography variant="label" className={'dia-monitor-label'}>
                              {t('splitAt')}
                            </HvTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <HvTypography>{''}</HvTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container columns={12} className={'train-info-item'} alignItems="center">
                      <Grid item xs={6}>
                        <Grid container columns={12} alignItems="center">
                          <Grid item xs={6}>
                            <HvTypography variant="label" className={'dia-monitor-label'}>
                              {t('trainsAfterSplit')}
                            </HvTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <HvTypography>{''}</HvTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <HvTypography>{''}</HvTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Grid container columns={12} alignItems="center">
                          {/* <Grid item xs={6}>
                            <HvTypography>{''}</HvTypography>
                          </Grid> */}
                          <Grid item xs={6}>
                            <HvButton variant="primary" className={'dia-monitor-button'}>
                              {' '}
                              {t('show')}{' '}
                            </HvButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container columns={12} className={'train-info-item'} alignItems="center">
                      <Grid item xs={6}>
                        <Grid container columns={6} alignItems="center">
                          <Grid item xs={6}>
                            <HvTypography variant="label" className={'dia-monitor-label'}>
                              {t('joinAt')}
                            </HvTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <HvTypography>{''}</HvTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container columns={12} className={'train-info-item'} alignItems="center">
                      <Grid item xs={6}>
                        <Grid container columns={12} alignItems="center">
                          <Grid item xs={6}>
                            <HvTypography variant="label" className={'dia-monitor-label'}>
                              {t('trainsBeforeJoin')}
                            </HvTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <HvTypography>{''}</HvTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <HvTypography>{''}</HvTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Grid container columns={12} alignItems="center">
                          {/* <Grid item xs={6}>
                            <HvTypography>{''}</HvTypography>
                          </Grid> */}
                          <Grid item xs={6}>
                            <HvButton variant="primary" className={'dia-monitor-button'}>
                              {' '}
                              {t('show')}{' '}
                            </HvButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* Stay at */}
                    <Grid container columns={16} className={'train-info-item'}>
                      <Grid item xs={8}>
                        <Grid container columns={8}>
                          <Grid item xs={4}>
                            <HvTypography variant="label" className={'dia-monitor-label'}>
                              {t('stayAt')}
                            </HvTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <HvTypography></HvTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* Power Type */}
                    <Grid container columns={16} className={'train-info-item'}>
                      <Grid item xs={8}>
                        <Grid container columns={8}>
                          <Grid item xs={4}>
                            <HvTypography
                              variant="label"
                              className={'dia-monitor-label'}
                              style={{ marginRight: '70px' }}>
                              {t('powerType')}
                            </HvTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <HvTypography className={'dia-monitor-label'}>
                              {train.trainTypeName}
                            </HvTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <HvTypography>-</HvTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </TabPanel>
                <TabPanel value="2">
                  <Root className={'timetable-content'} sx={{ maxWidth: '100%', width: 600 }}>
                    <div className="hide-column">
                      <HvButton
                        id="demo-customized-button"
                        aria-controls={open ? 'demo-customized-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        variant="primary"
                        onClick={handleClickMenu}
                        className={'dia-monitor-button'}>
                        {t('filter')}
                      </HvButton>
                      <StyledMenu
                        id="demo-customized-menu"
                        MenuListProps={{
                          'aria-labelledby': 'demo-customized-button'
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}>
                        <MenuItem disableRipple>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onClick={checkBoxAllHandler}
                                checked={isShowAllTableColumns}
                              />
                            }
                            label={<Typography className="fcl-font-size">{t('all')}</Typography>}
                          />
                        </MenuItem>
                        {timeTableColumns.map((column, index) => (
                          <MenuItem disableRipple>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onClick={(e) => checkBoxHandler(index, column.isActive)}
                                  checked={column.isActive}
                                />
                              }
                              label={
                                <Typography className="fcl-font-size">{t(column.name)}</Typography>
                              }
                            />
                          </MenuItem>
                        ))}
                      </StyledMenu>
                    </div>
                    <TimeTable timeTableColumns={timeTableColumns} train={train} />
                  </Root>
                </TabPanel>
              </TabContext>
            </TabPanel>
          ))}
        </TabContext>
      )}
    </Rnd>
  );
}

const grey = {
  200: '#d0d7de',
  800: '#32383f',
  900: '#24292f'
};

const Root = styled('div')(
  ({ theme }) => `
  table {
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    text-align: left;
    padding: 8px;
  }

  th {
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  }
  `
);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    zIndex: 5666680,
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    }
  }
}));
