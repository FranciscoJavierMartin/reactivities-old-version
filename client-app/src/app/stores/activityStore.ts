import { SyntheticEvent } from 'react';
import { observable, action, computed, runInAction } from 'mobx';
import { IActivity } from './../models/activity';
import agent from '../api/agent';
import { ACTIVITIES_ROUTE } from '../constants/routes';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';

export default class ActivityStore {

  constructor(private rootStore: RootStore){}

  @observable activityRegistry = new Map<string, IActivity>();
  @observable activity: IActivity | null = null;
  @observable loadingInitial: boolean = false;
  @observable submitting: boolean = false;
  @observable target: string = '';

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split('.')[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction('loading activities', () => {
        activities.forEach((activity: IActivity) => {
          activity.date = new Date(activity.date);
          this.activityRegistry.set(activity.id, activity);
        });
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction('finishing loading activities', () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    let selectedActivity = this.getActivity(id);

    if (selectedActivity) {
      this.activity = selectedActivity;
    } else {
      this.loadingInitial = true;
      try {
        selectedActivity = await agent.Activities.details(id);
        runInAction('getting activity', () => {
          selectedActivity!.date = new Date(selectedActivity!.date);
          this.activity = selectedActivity!;
          this.activityRegistry.set(this.activity.id, selectedActivity!);
        });
      } catch (error) {
        console.error(error);
      } finally {
        runInAction('get activity error', () => {
          this.loadingInitial = false;
        });
      }
    }
    return selectedActivity!;
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action selectActivity = (id: string) => {
    this.activity = this.activityRegistry.get(id) || null;
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);
      });
      history.push(`${ACTIVITIES_ROUTE}/${activity.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Problem submitting data');
    } finally {
      runInAction('creating activity finishing', () => {
        this.submitting = false;
      });
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.update(activity);
      runInAction('editing activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
      history.push(`${ACTIVITIES_ROUTE}/${activity.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      runInAction('editing activity finishing', () => {
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction('delete activity', () => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction('delete activity finishing', () => {
        this.submitting = false;
        this.target = '';
      });
    }
  };
}