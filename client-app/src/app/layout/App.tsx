import React, { Fragment, useEffect, useState, SyntheticEvent } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

const App: React.FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [target, setTarget] = useState<string>('');

  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(activities.find(a => a.id === id) || null);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.create(activity)
      .then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
      })
      .finally(() => setSubmitting(false));
  };

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity)
      .then(() => {
        setActivities([
          ...activities.filter(a => a.id !== activity.id),
          activity
        ]);
        setSelectedActivity(activity);
        setEditMode(false);
      })
      .finally(() => setSubmitting(false));
  };

  const handleDeleteActivity = (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id)
      .then(() => {
        setActivities([...activities.filter(a => a.id !== id)]);
      })
      .finally(() => setSubmitting(false));
  };

  useEffect(() => {
    agent.Activities.list()
      .then((response: IActivity[]) => {
        const activities: IActivity[] = response.map(
          (activity: IActivity): IActivity => ({
            ...activity,
            date: activity.date.split('.')[0]
          })
        );
        setActivities(activities);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return loading ? (
    <LoadingComponent content={'Loading activities...'} />
  ) : (
    <Fragment>
      <NavBar openCreateFrom={handleOpenCreateForm} />
      <Container
        style={{
          marginTop: '7em'
        }}
      >
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectedActivity}
          selectedActivity={selectedActivity!}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </Container>
    </Fragment>
  );
};

export default App;
