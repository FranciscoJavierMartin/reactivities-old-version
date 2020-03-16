import { createContext, SyntheticEvent } from 'react';
import { observable, action, computed, configure, runInAction } from 'mobx';
import { IActivity } from './../models/activity';
import agent from '../api/agent';

configure({
  enforceActions: 'always'
});

class ActivityStore {
  @observable activityRegistry = new Map<string, IActivity>();
  @observable activity: IActivity | null = null;
  @observable loadingInitial: boolean = false;
  @observable submitting: boolean = false;
  @observable target: string = '';

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  }

  groupActivitiesByDate(activities: IActivity[]){
    const sortedActivities = activities.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );

    return Object.entries(sortedActivities.reduce((activities, activity) => {
      const date = activity.date.split('T')[0];
      activities[date] = activities[date] ? [...activities[date], activity] : [activity];
      return activities;
    }, {} as {[key: string]: IActivity[]}));

  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction('loading activities', () => {
        activities.forEach((activity: IActivity) => {
          activity.date = activity.date.split('.')[0];
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
    const activityFromRegister = this.getActivity(id);
    if(activityFromRegister){
      this.activity = activityFromRegister;
    } else {
      this.loadingInitial = true;
      try{
        const selectedActivity = await agent.Activities.details(id);
        runInAction('getting activity', () => {
          this.activity = selectedActivity;
        });
      } catch(error){
        console.error(error);
      } finally {
        runInAction('get activity error', () => {
          this.loadingInitial = false;
        });
      }
    }
  }

  @action clearActivity = () => {
    this.activity = null
  }

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

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
    } catch (error) {
      console.error(error);
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

export default createContext(new ActivityStore());
