import { v4 as uuid } from 'uuid';
import {
  HvHeader,
  HvHeaderNavigation,
  HvVerticalNavigation,
  HvVerticalNavigationTree,
  HvHeaderBrand,
  HvVerticalNavigationHeader,
  HvVerticalNavigationActions,
  HvVerticalNavigationAction,
} from '@hitachivantara/uikit-react-core';
import HitachiLogo from '../assets/HitachiLogo';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      <HvHeader position="relative">
        <HvHeaderBrand
          logo={<HitachiLogo />}
          name="Inspire The Next"
        />
      </HvHeader>
      <div
        style={{
          display: 'flex',
          height: 'calc(100vh - 64px)',
          width: '100%',
        }}
      >
        <HvVerticalNavigation
          open
        >
          <HvVerticalNavigationTree
            aria-label="Example 1 navigation"
            data={[
              {
                href: '/kpi',
                id: uuid(),
                label: 'KPI'
              },
              {
                href: '/intervention',
                id: uuid(),
                label: 'Intervention'
              },
              {
                href: '/user',
                id: uuid(),
                label: 'User'
              },

            ]}
            onChange={function _a() { }}
            selected="00"
          />
        </HvVerticalNavigation>
        <Outlet/>
      </div>
    </div>
  );
};

export default MainLayout;