import React, { useEffect, useState } from 'react';
import {
  HvButton,
  HvCheckBox,
  HvDropdown,
  HvGrid,
  HvInput,
  HvPanel,
  HvTypography
} from '@hitachivantara/uikit-react-core';
import { useTranslation } from 'react-i18next';
import NumericInput from 'react-numeric-input';
import TypoScreenName from '../../components/typographys/typoScreenName';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/styles/setting/Setting.module.css';
import initializeApi from '../../services/apis/initializeApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  TimetableState,
  setConfiguration,
  setSimRailRoads
} from '../../redux/reducers/timetable.reducer';

export default function Setting() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { time } = useSelector((state: any) => state.timetableReducer);
  const { t, i18n } = useTranslation();
  const [companyListLabel, setCompanyListLabel] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [config, setConfig] = useState<TimetableState>({
    companyName: '',
    time: { hour: 7, minute: 0 }
  });
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const onChangeHour = (value) => {
    setHour(value);
  };

  const onChangeMinute = (value) => {
    setMinute(value);
  };
  const onChangeCompanyName = (event: any) => {
    const selectedCompanyName = event?.id;
    setConfig({ ...time, companyName: selectedCompanyName });

    if (!selectedCompanyName) {
      setError(t('errorEmptyCompanyName'));
    } else {
      setError('');
    }
  };

  useEffect(() => {
    initializeApi
      .getInitialize()
      .then((response) => {
        if (response.data) {
          const companies = response.data?.companies;
          if (companies && companies.length) {
            const uniqueCompany = Array.from(
              new Set(companies.map((item: any) => item.railCompany))
            );
            const uniqueCompanyArray = uniqueCompany.map((name) => ({
              id: name,
              label: name
            }));
            setCompanyListLabel(uniqueCompanyArray);
          }
          dispatch(setSimRailRoads(response.data.simRailRoads));
        }
        // <Alert severity="error">Get initialize error!</Alert>;
      })
      .catch(() => {
        <Alert severity="error">Get initialize error!</Alert>;
      });
    initializeApi
      .getConfiguration('OTHER')
      .then()
      .catch(() => {
        <Alert severity="error">Get configuration error!</Alert>;
      });
    if (i18n.language !== currentLanguage) {
      setError(t('errorEmptyCompanyName'));
      setCurrentLanguage(i18n.language);
    }
  }, [dispatch, i18n.language, currentLanguage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!config.companyName) {
      setError(t('errorEmptyCompanyName'));
      return;
    }
    const data = {
      hour: (document.querySelector('#hour') as HTMLInputElement).value,
      minus: (document.querySelector('#minus') as HTMLInputElement).value,
      achievement: (document.querySelector('#achievement-input') as HTMLInputElement).checked,
      companyName: config?.companyName
    };
    dispatch(
      setConfiguration({
        time: { hour: Number(data.hour), minute: Number(data.minus) },
        companyName: config.companyName
      })
    );
    initializeApi
      .postInitialize(data)
      .then(() => {
        // do something
        navigate('/diamanmachine');
      })
      .catch(() => {
        <Alert severity="error">Get initialize error!</Alert>;
      });
  };

  return (
    <div className={styles['background-form']}>
      <HvPanel className={styles['form-panel']}>
        <div style={{ paddingLeft: 20 }}>
          <TypoScreenName title={t('setting')} fontSize={'30px'} />
          <br />
          <form>
            <div className={styles.row}>
              <HvTypography variant="title4">{t('time')} </HvTypography>

              <div className={styles['field-time']}>
                <NumericInput
                  id="hour"
                  className={styles['number-input']}
                  min={0}
                  max={28}
                  value={hour}
                  onChange={onChangeHour}
                />
                <HvTypography className={styles['field-title']} variant="title4">
                  {t('hour')}
                </HvTypography>
              </div>
              <div className={styles['field-time']}>
                <NumericInput
                  id="minus"
                  className={styles['number-input-minus']}
                  min={0}
                  max={100}
                  value={minute}
                  onChange={onChangeMinute}
                />
                <HvTypography
                  className={styles['field-title']}
                  variant="title4"
                  style={{ marginRight: 10 }}
                >
                  {t('minute')}
                </HvTypography>
              </div>

              <HvCheckBox id="achievement-input" label={t('operation')} />
            </div>
            <HvGrid className={styles['align-item-center']} container>
              <HvGrid item xs={4}>
                <HvTypography variant="title4">{t('companyName')} </HvTypography>
              </HvGrid>
              <HvGrid item xs={8}>
                <HvDropdown
                  className={styles['dropdown-input']}
                  aria-label="With search"
                  id="drop6"
                  onChange={onChangeCompanyName}
                  values={companyListLabel}
                />
              </HvGrid>
              <HvGrid item md={4} sm={4} xs={12}>
                <HvButton
                  variant="primary"
                  type="button"
                  onClick={handleSubmit}
                  className={styles['button']}
                >
                  {t('startApp')}
                </HvButton>
              </HvGrid>
              <HvGrid item md={8} sm={8} xs={12}>
                <HvInput
                  id="something"
                  className={styles['text-input']}
                  style={{ borderRadius: '10px' }}
                  readOnly={true}
                  minCharQuantity={0}
                  type="text"
                  value={error}
                />
              </HvGrid>
            </HvGrid>
          </form>
        </div>
      </HvPanel>
    </div>
  );
}
