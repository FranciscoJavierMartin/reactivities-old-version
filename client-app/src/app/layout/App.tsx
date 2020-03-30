import React, { Fragment, useContext, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch
} from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import {
  HOME_ROUTE,
  ACTIVITIES_ROUTE,
  CREATE_ACTIVITY_ROUTE,
  MANAGE_ACTIVITY_ROUTE,
  PROFILE_ROUTE
} from '../constants/routes';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoute from './PrivateRoute';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => {
        setAppLoaded();
      });
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token]);

  return !appLoaded ? (
    <LoadingComponent content='Loading app...' />
  ) : (
    <Fragment>
      <ModalContainer />
      <ToastContainer position='bottom-right' />
      <Route exact path={`/${HOME_ROUTE}`} component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <Fragment>
            <NavBar />
            <Container
              style={{
                marginTop: '7em'
              }}
            >
              <Switch>
                <PrivateRoute
                  exact
                  path={`/${ACTIVITIES_ROUTE}`}
                  component={ActivityDashboard}
                />
                <PrivateRoute
                  path={`/${ACTIVITIES_ROUTE}/:id`}
                  component={ActivityDetails}
                />
                <PrivateRoute
                  key={location.key}
                  path={[
                    `/${CREATE_ACTIVITY_ROUTE}`,
                    `/${MANAGE_ACTIVITY_ROUTE}/:id`
                  ]}
                  component={ActivityForm}
                />
                <PrivateRoute
                  path={`/${PROFILE_ROUTE}/:username`}
                  component={ProfilePage}
                />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
