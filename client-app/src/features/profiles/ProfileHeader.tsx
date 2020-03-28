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
}

const ProfileHeader: FC<IProfileHeaderProps> = ({ profile }) => {
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
            <Statistic label='Followers' value='5' />
            <Statistic label='Following' value='42' />
          </Statistic.Group>
          <Divider />
          <Reveal animated='move'>
            <Reveal.Content visible style={{ width: '100%' }}>
              <Button fluid color='teal' content='Following' />
            </Reveal.Content>
            <Reveal.Content hidden>
              <Button
                fluid
                basic
                content={true ? 'Unfollow' : 'Follow'}
                color={true ? 'red' : 'green'}
              />
            </Reveal.Content>
          </Reveal>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(ProfileHeader);
