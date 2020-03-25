import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import {
  IActivityFormValues,
  ActivityFormValues
} from '../../../app/models/activity';
import { RouteComponentProps } from 'react-router-dom';
import { ACTIVITIES_ROUTE } from '../../../app/constants/routes';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/util/util';
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan
} from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least 5 characters'
    })
  )(),
  city: isRequired('City'),
  venue: isRequired('City'),
  date: isRequired('Date'),
  time: isRequired('Time')
});

interface DetailParams {
  id: string;
}

interface IActivityFormProps extends RouteComponentProps<DetailParams> {}

const ActivityForm: React.FC<IActivityFormProps> = ({ match, history }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity
  } = rootStore.activityStore;

  const [activity, setActivity] = useState<IActivityFormValues>(
    new ActivityFormValues()
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then(activity => setActivity(activity))
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;

    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  placeholder='Title'
                  value={activity.title}
                  name='title'
                  component={TextInput}
                />
                <Field
                  placeholder='Description'
                  name='description'
                  rows={3}
                  value={activity.description}
                  component={TextAreaInput}
                />
                <Field
                  placeholder='Category'
                  value={activity.category}
                  name='category'
                  options={category}
                  component={SelectInput}
                />
                <Form.Group widths='equal'>
                  <Field
                    placeholder='Date'
                    value={activity.date!}
                    name='date'
                    date={true}
                    component={DateInput}
                  />

                  <Field
                    placeholder='Date'
                    value={activity.date!}
                    name='time'
                    time={true}
                    component={DateInput}
                  />
                </Form.Group>
                <Field
                  placeholder='City'
                  value={activity.city}
                  name='city'
                  component={TextInput}
                />
                <Field
                  placeholder='Venue'
                  value={activity.venue}
                  name='venue'
                  component={TextInput}
                />
                <Button
                  loading={submitting}
                  floated='right'
                  positive
                  type='submit'
                  content='Submit'
                  disabled={loading  || invalid || pristine}
                />
                <Button
                  onClick={
                    activity.id
                      ? () =>
                          history.push(`/${ACTIVITIES_ROUTE}/${activity.id}`)
                      : () => history.push(`/${ACTIVITIES_ROUTE}`)
                  }
                  floated='right'
                  type='button'
                  content='Cancel'
                  disabled={loading}
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default ActivityForm;
