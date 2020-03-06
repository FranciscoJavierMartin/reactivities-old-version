import React, { Fragment, useEffect, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';

const App: React.FC = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  return activityStore.loadingInitial ? (
    <LoadingComponent content={'Loading activities...'} />
  ) : (
    <Fragment>
      <NavBar />
      <Container
        style={{
          marginTop: '7em'
        }}
      >
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
};

export default observer(App);
