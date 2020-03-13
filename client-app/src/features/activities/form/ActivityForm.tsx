import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { IActivity } from '../../../app/models/activity';
import ActivityStore from '../../../app/stores/activityStore';
import { RouteComponentProps } from 'react-router-dom';
import { ACTIVITIES_ROUTE } from '../../../app/constants/routes';

interface DetailParams {
  id: string;
}

interface IActivityFormProps extends RouteComponentProps<DetailParams> {}

const ActivityForm: React.FC<IActivityFormProps> = ({ match, history }) => {
  const activityStore = useContext(ActivityStore);
  const {
    activity: initialFormState,
    createActivity,
    editActivity,
    submitting,
    loadActivity,
    clearActivity
  } = activityStore;

  const [activity, setActivity] = useState<IActivity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  });

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(
        () => initialFormState && setActivity(initialFormState)
      );
    }

    return () => {
      clearActivity();
    };
  }, [
    loadActivity,
    clearActivity,
    match.params.id,
    initialFormState,
    activity.id.length
  ]);

  const handleInputChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      const newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity).then(() =>
        history.push(`/${ACTIVITIES_ROUTE}/${newActivity.id}`)
      );
    } else {
      editActivity(activity).then(() =>
        history.push(`/${ACTIVITIES_ROUTE}/${activity.id}`)
      );
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              placeholder='Title'
              value={activity.title}
              onChange={handleInputChange}
              name='title'
            />
            <Form.TextArea
              rows={2}
              placeholder='Description'
              name='description'
              value={activity.description}
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder='Category'
              value={activity.category}
              name='category'
              onChange={handleInputChange}
            />

            <Form.Input
              placeholder='Date'
              type='datetime-local'
              value={activity.date}
              name='date'
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder='City'
              value={activity.city}
              name='city'
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder='Venue'
              value={activity.venue}
              name='venue'
              onChange={handleInputChange}
            />
            <Button
              loading={submitting}
              floated='right'
              positive
              type='submit'
              content='Submit'
            />
            <Button
              onClick={() => history.push(`/${ACTIVITIES_ROUTE}`)}
              floated='right'
              type='button'
              content='Cancel'
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default ActivityForm;
