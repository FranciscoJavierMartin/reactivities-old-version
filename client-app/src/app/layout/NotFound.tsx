import React from 'react';
import { Segment, Header, Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { ACTIVITIES_ROUTE } from '../constants/routes';

const NotFound = () => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name='search' />
        Oops - we0ve locked everywhere but couldn't find this.
      </Header>
      <Segment.Inline>
        <Button as={Link} to={`/${ACTIVITIES_ROUTE}`} primary>
          Return to activities page
        </Button>
      </Segment.Inline>
    </Segment>
  );
};

export default NotFound;
