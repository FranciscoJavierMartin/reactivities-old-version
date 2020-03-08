import React, { useContext, useEffect } from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import { RouteComponentProps, Link } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { MANAGE_ACTIVITY_ROUTE } from '../../../app/constants/routes';

interface IDetailParams {
  id: string;
}

interface IActivityDetailsProps extends RouteComponentProps<IDetailParams> {}

const ActivityDetails: React.FC<IActivityDetailsProps> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    activity,
    loadActivity,
    loadingInitial
  } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  return loadingInitial || !activity ? (
    <LoadingComponent content='Loading activity...' />
  ) : (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${activity!.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span>{activity!.date}</span>
        </Card.Meta>
        <Card.Description>{activity!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            as={Link}
            to={`/${MANAGE_ACTIVITY_ROUTE}/${activity.id}`}
            basic
            color='blue'
            content='Edit'
          />
          <Button
            onClick={() => history.goBack()}
            basic
            color='grey'
            content='Cancel'
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetails);
