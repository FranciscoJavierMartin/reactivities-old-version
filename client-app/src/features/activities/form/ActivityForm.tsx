import React, { useState, useContext } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { IActivity } from '../../../app/models/activity';
import ActivityStore from '../../../app/stores/activityStore';

interface IActivityFormProps {
  activity: IActivity | undefined;
}

const initializeForm = (initialData: IActivity | undefined): IActivity => {
  return (
    initialData || {
      id: '',
      title: '',
      category: '',
      description: '',
      date: '',
      city: '',
      venue: ''
    }
  );
};

const ActivityForm: React.FC<IActivityFormProps> = ({
  activity: initialFormState,
}) => {
  const activityStore = useContext(ActivityStore);
  const { createActivity, editActivity, submitting, cancelFormOpen } = activityStore;
  
  const [activity, setActivity] = useState<IActivity>(
    initializeForm(initialFormState)
  );

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
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  return (
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
        <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
        <Button
          onClick={cancelFormOpen}
          floated='right'
          type='button'
          content='Cancel'
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
