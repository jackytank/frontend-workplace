import {
  HvHeader,
  HvHeaderActions,
  HvHeaderBrand,
  HvBadge
} from '@hitachivantara/uikit-react-core';

import HitachiLogo from '../../../assets/hitachiLogo';
import { WorldGlobe } from '@hitachivantara/uikit-react-icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../../assets/styles/header/header.module.css';

export const Header = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(localStorage.getItem('selectedLanguage') || 'English');

  const selectLanguage = (language: string) => {
    const selectedLang = language === 'ja' ? 'Japan' : 'English';
    setLang(selectedLang);
    i18n.changeLanguage(language);
    localStorage.setItem('selectedLanguage', selectedLang);
  };

  useEffect(() => {
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (selectedLanguage) {
      setLang(selectedLanguage);
      i18n.changeLanguage(selectedLanguage === 'Japan' ? 'ja' : 'en');
    }
  }, []);

  return (
    <HvHeader style={{ position: 'absolute', zIndex: 999999999 }}>
      <HvHeaderBrand logo={<HitachiLogo />} name="Timetable Rescheduling Application" />

      <HvHeaderActions>
        <React.Fragment key=".0">
          <div className={styles['dropdown']}>
            <div className={styles['dropbtn']}>
              <HvBadge icon={<WorldGlobe />} />
              <p>{lang}</p>
            </div>
            <div className={styles['dropdown-content']}>
              <a onClick={() => selectLanguage('en')}>English</a>
              <a onClick={() => selectLanguage('ja')}>Japan</a>
            </div>
          </div>
        </React.Fragment>
      </HvHeaderActions>
    </HvHeader>
  );
};
