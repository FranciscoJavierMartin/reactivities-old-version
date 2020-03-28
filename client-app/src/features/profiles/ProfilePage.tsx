import React, { useContext, useEffect, FC } from 'react';
import { Grid } from 'semantic-ui-react';
import ProfileHeader from './ProfileHeader';
import ProfileContent from './ProfileContent';
import { RootStoreContext } from '../../app/stores/rootStore';
import { RouteComponentProps } from 'react-router-dom';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';

interface RouteParams {
  username: string;
}

interface IProfilePageProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: FC<IProfilePageProps> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const { loadingProfile, profile, loadProfile } = rootStore.profileStore;

  useEffect(() => {
    loadProfile(match.params.username);
  }, [loadProfile, match]);

  return loadingProfile ? (
    <LoadingComponent content='Loading profile...' />
  ) : (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile!}/>
        <ProfileContent />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
