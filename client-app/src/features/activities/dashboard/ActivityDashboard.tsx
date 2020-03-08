import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import LoadingComponent from '../../../app/layout/LoadingComponent';

interface IActivityDashboardProps {}

const ActivityDashboard: React.FC<IActivityDashboardProps> = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);
  
  return activityStore.loadingInitial ? (
    <LoadingComponent content={'Loading activities...'} />
  ) :(
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Activity filters</h2>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
