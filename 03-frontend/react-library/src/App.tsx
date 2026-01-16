import React from 'react';
import './App.css';
import { HomePage } from './layouts/HomePage/HomePage';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { SearchWorkoutsPage } from './layouts/SearchWorkoutsPage/SearchWorkoutsPage';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { ActiveWorkoutPage } from './layouts/ActiveWorkoutPage.tsx/ActiveWorkoutPage';

import { auth0Config } from './lib/auth0Config';
import LoginPage from './Auth/LoginPage';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';

/**
 * Auth0 인증 상태를 관리하는 커스텀 Provider 컴포넌트.
 * Auth0의 인증 흐름을 React Router의 브라우저 히스토리와 연결하는 역할.
 */
const Auth0ProviderWithHistory = ({ children }: { children: React.ReactNode }) => {
  const history = useHistory();

  // Auth0 서버에서 인증을 마치고 사용자가 앱으로 돌아왔을 때(Redirect) 자동 실행되는 콜백 함수.
  const onRedirectCallback = (appState: any) => {
    // 인증 전 위치 혹은 home 리턴
    history.push(appState?.returnTo || "/home");
  }

  return (
    <Auth0Provider
      domain={auth0Config.issuer}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

const SecureRoute = ({ component, path, ...args }: { component: React.ComponentType<any>, path: string }) => (
  <Route path={path} component={withAuthenticationRequired(component)} {...args} />
);

export const App = () => {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Auth0ProviderWithHistory>
        <Navbar />
        <div className='flex-grow-1'>
          <Switch>
            <Route path='/' exact>
              <Redirect to='/home' />
            </Route>
            <Route path='/home'>
              <HomePage />
            </Route>
            <Route path='/search'>
              <SearchWorkoutsPage />
            </Route>
            {/* <Route path='/reviewlist/:workoutId'>
              <ReviewListPage/>
            </Route> */}
            <Route path='/Active/:WorkoutId'>
              <ActiveWorkoutPage />
            </Route>
            <Route path='/login' render={() => <LoginPage />} />
            {/* <SecureRoute path='/shelf' component={ShelfPage}/>
            <SecureRoute path='/messages' component={MessagesPage}/>
            <SecureRoute path='/admin' component={ManageLibraryPage}/> */}
          </Switch>
        </div>
        <Footer />
      </Auth0ProviderWithHistory>
    </div>
  );
}


