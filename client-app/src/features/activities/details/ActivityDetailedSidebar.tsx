import React, { Fragment, FC } from 'react';
import { Segment, List, Label, Image, Item } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { MAIN_COLOR } from '../../../app/constants/common';
import { IAttendee } from '../../../app/models/activity';
import { PROFILE_ROUTE } from '../../../app/constants/routes';
import { observer } from 'mobx-react-lite';

interface IActivityDetailedSidebarProps {
  attendees: IAttendee[];
}

const ActivityDetailedSidebar: FC<IActivityDetailedSidebarProps> = ({
  attendees
}) => {
  const isHost = false;
  return (
    <Fragment>
      <Segment
        textAlign='center'
        style={{ border: 'none' }}
        attached='top'
        secondary
        inverted
        color={MAIN_COLOR}
      >
        {attendees.length} {attendees.length > 1 ? 'People' : 'Person'} going
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees.map((attendee: IAttendee) => (
            <Item key={attendee.username} style={{ position: 'relative' }}>
              {attendee.isHost && (
                <Label
                  style={{ position: 'absolute' }}
                  color='orange'
                  ribbon='right'
                >
                  Host
                </Label>
              )}
              <Image size='tiny' src={attendee.image || '/assets/user.png'} />
              <Item.Content verticalAlign='middle'>
                <Item.Header as='h3'>
                  <Link to={`/${PROFILE_ROUTE}/${attendee.username}`}>
                    {attendee.displayName}
                  </Link>
                </Item.Header>
                <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
              </Item.Content>
            </Item>
          ))}
        </List>
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailedSidebar);
