import { useMemo, createContext } from 'react';
import { Header, Footer } from '../../components/common';
import useNavigation from '../hooks/useNavigation';
import { HvLoading } from '@hitachivantara/uikit-react-core';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/config-store';
import './index.css';

interface NavigationProviderProps {
  children: React.ReactNode;
  navigation: NavigationData[];
}

export const NavigationContext = createContext<NavigationContextValue>({
  navigation: [],
  activePath: undefined
});

export const NavigationProvider = ({ children, navigation }: NavigationProviderProps) => {
  const { activePath } = useNavigation(navigation);
  const { loading } = useSelector((state: RootState) => state.loadingReducer);
  const value = useMemo(
    () => ({
      navigation,
      activePath
    }),
    [activePath, navigation]
  );

  return (
    <NavigationContext.Provider value={value}>
      <Header />
      <div className={loading.state === 'loading' ? 'content-container-onload' : ''}>
        <HvLoading
          className="loading-modal"
          hidden={loading.state === 'done'}
          label={loading.label}
        />
        <div className={loading.state === 'loading' ? 'onload-state' : ''}></div>
        {children}
      </div>
      <Footer />
    </NavigationContext.Provider>
  );
};
