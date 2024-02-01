import {
  HvHeader,
  HvVerticalNavigation,
  HvVerticalNavigationTree,
  HvHeaderBrand,
  HvVerticalNavigationHeader,
  HvFooter,
} from '@hitachivantara/uikit-react-core';
import HitachiLogo from '../assets/HitachiLogo';
import { Outlet } from 'react-router-dom';
import { Backwards, Menu } from '@hitachivantara/uikit-react-icons';
import { useState } from 'react';
import { Grid } from '@mui/material';

const MainLayout = () => {
  const [openNav, setOpenNav] = useState(true);
  const [navSelected, setNavSelected] = useState(localStorage.getItem('navSelected') || '1');

  return (
    <>
      <HvHeader position="relative">
        <HvHeaderBrand
          logo={<HitachiLogo />}
          name="Inspire The Next"
        />
      </HvHeader>
      < Grid
        minHeight={window.innerHeight}
        height="100%"
        display="flex"
      >
        <HvVerticalNavigation
          open={openNav}
          useIcons={false}
        >
          <HvVerticalNavigationHeader
            collapseButtonProps={{
              'aria-expanded': true,
              'aria-label': 'collapseButton'
            }}
            onCollapseButtonClick={() => setOpenNav((openNav) => !openNav)}
            title=""
            openIcon={<Menu />}
            closeIcon={<Backwards />}
          />
          <HvVerticalNavigationTree
            aria-label="Example 1 navigation"
            collapsible
            data={[
              {
                id: '1',
                href: '/kpi',
                label: 'KPI'
              },
              {
                id: '2',
                href: '/intervention',
                label: 'Intervention'
              },
              {
                id: '3',
                href: '/user',
                label: 'User'
              },

            ]}
            defaultExpanded={false}
            onChange={(event, page) => {
              localStorage.setItem('navSelected', page.id);
              setNavSelected(page.id);
              if (openNav === false) setOpenNav(true);
            }}
            selected={navSelected}
          />
        </HvVerticalNavigation>
        <Outlet />
      </Grid>
      <HvFooter
        copyright="© Hitachi Digital Services 2024"
        name="Hitachi Digital Services"
      />
    </>
  );
};

export default MainLayout;