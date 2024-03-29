import React, { FC } from 'react';
import {
  Segment,
  Grid,
  Item,
  Header,
  Statistic,
  Divider,
  Reveal,
  Button
} from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { observer } from 'mobx-react-lite';

interface IProfileHeaderProps {
  profile: IProfile;
  follow: (username: string) => void;
  unfollow: (username: string) => void;
  isCurrentUser: boolean;
  loading: boolean;
}

const ProfileHeader: FC<IProfileHeaderProps> = ({
  profile,
  isCurrentUser,
  loading,
  unfollow,
  follow
}) => {
  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size='small'
                src={profile.image || '/assets/user.png'}
              />
              <Item.Content verticalAlign='middle'>
                <Header as='h1'>{profile.displayName}</Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group widths={2}>
            <Statistic label='Followers' value={profile.followersCount} />
            <Statistic label='Following' value={profile.followingCount} />
          </Statistic.Group>
          <Divider />
          {!isCurrentUser && (
            <Reveal animated='move'>
              <Reveal.Content visible style={{ width: '100%' }}>
                <Button
                  fluid
                  color='teal'
                  content={profile.following ? 'Following' : 'Not following'}
                />
              </Reveal.Content>
              <Reveal.Content hidden>
                <Button
                  fluid
                  basic
                  loading={loading}
                  content={profile.following ? 'Unfollow' : 'Follow'}
                  color={profile.following ? 'red' : 'green'}
                  onClick={
                    profile.following
                      ? () => unfollow(profile.username)
                      : () => follow(profile.username)
                  }
                />
              </Reveal.Content>
            </Reveal>
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(ProfileHeader);
