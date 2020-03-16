import React, { Fragment } from 'react';
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
  MANAGE_ACTIVITY_ROUTE
} from '../constants/routes';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
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
                <Route
                  exact
                  path={`/${ACTIVITIES_ROUTE}`}
                  component={ActivityDashboard}
                />
                <Route
                  path={`/${ACTIVITIES_ROUTE}/:id`}
                  component={ActivityDetails}
                />
                <Route
                  key={location.key}
                  path={[
                    `/${CREATE_ACTIVITY_ROUTE}`,
                    `/${MANAGE_ACTIVITY_ROUTE}/:id`
                  ]}
                  component={ActivityForm}
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
