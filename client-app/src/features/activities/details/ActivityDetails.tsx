import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';
import { NOT_FOUND_ROUTE } from '../../../app/constants/routes';
import { RootStoreContext } from '../../../app/stores/rootStore';

interface IDetailParams {
  id: string;
}

interface IActivityDetailsProps extends RouteComponentProps<IDetailParams> {}

const ActivityDetails: React.FC<IActivityDetailsProps> = ({ match, history }) => {
  const rootStore = useContext(RootStoreContext);
  const { activity, loadActivity, loadingInitial } = rootStore.activityStore;

  useEffect(() => {
    loadActivity(match.params.id).catch(() => {
      history.push(`/${NOT_FOUND_ROUTE}`)
    });
  }, [loadActivity, match.params.id, history]);

  return loadingInitial ? (
    <LoadingComponent content='Loading activity...' />
  ) : !activity ? (
    <h2>Activity not found</h2>
  ) : (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar attendees={activity.attendees}/>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
