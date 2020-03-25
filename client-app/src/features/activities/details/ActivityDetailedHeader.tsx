import React from 'react';
import { observer } from 'mobx-react-lite';
import { Segment, Image, Item, Header, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { Link } from 'react-router-dom';
import { MANAGE_ACTIVITY_ROUTE } from '../../../app/constants/routes';
import { format } from 'date-fns';
import { MAIN_COLOR } from '../../../app/constants/common';

const activityImageStyle = {
  filter: 'brightness(30%)'
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

interface IActivityDetailHeaderProps {
  activity: IActivity;
}

const ActivityDetailedHeader: React.FC<IActivityDetailHeaderProps> = ({
  activity
}) => {
  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size='huge'
                  content={activity.title}
                  style={{ color: 'white' }}
                />
                <p>{format(activity.date, 'eeee do MMMM')}</p>
                <p>
                  Hosted by <strong>Bob</strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        <Button color={MAIN_COLOR}>Join activity</Button>
        <Button>Cancel attendance</Button>
        <Button
          as={Link}
          to={`/${MANAGE_ACTIVITY_ROUTE}/${activity.id}`}
          color='orange'
          floated='right'
        >
          Manage event
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedHeader);
