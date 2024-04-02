import { Suspense, FC } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Container } from '../components/common';
import { NavigationProvider } from '../lib/context/navigationContext';
import navigation from '../lib/navigation';
import { routes } from './list-route.router';

const AppRouter: FC = () => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            minWidth: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white'
          }}
        >
          <img style={{ width: '10%' }} src="./images/loading.gif" alt="Loading" />
        </div>
      }
    >
      <Router>
        <NavigationProvider navigation={navigation}>
          <Container maxWidth="xl">
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.component} />
              ))}
            </Routes>
          </Container>
        </NavigationProvider>
      </Router>
    </Suspense>
  );
};

export default AppRouter;
