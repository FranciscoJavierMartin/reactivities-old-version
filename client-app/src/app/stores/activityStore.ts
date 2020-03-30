import { SyntheticEvent } from 'react';
import { observable, action, computed, runInAction, reaction } from 'mobx';
import {
  IActivity,
  IAttendee,
  IComment,
  IActivitiesEnvelope
} from './../models/activity';
import agent from '../api/agent';
import { ACTIVITIES_ROUTE } from '../constants/routes';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { setActivityProps, createAttendee } from '../common/util/util';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel
} from '@microsoft/signalr';

const LIMIT = 2;

export default class ActivityStore {
  constructor(private rootStore: RootStore) {
    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.activityRegistry.clear();
        this.loadActivities();
      }
    );
  }

  @observable activityRegistry = new Map<string, IActivity>();
  @observable activity: IActivity | null = null;
  @observable loadingInitial: boolean = false;
  @observable submitting: boolean = false;
  @observable target: string = '';
  @observable loading: boolean = false;
  @observable.ref hubConnection: HubConnection | null = null;
  @observable activityCount: number = 0;
  @observable page: number = 0;
  @observable predicate = new Map<string, string | Date>();

  @computed get totalPages() {
    return Math.ceil(this.activityCount / LIMIT);
  }

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append('limit', String(LIMIT));
    params.append('offset', `${this.page ? this.page * LIMIT : 0}`);

    this.predicate.forEach((value: string | Date, key: string) => {
      if (typeof value === 'string') {
        params.append(key, value);
      } else {
        params.append(key, value.toISOString());
      }
    });

    return params;
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
      const activitiesEnvelope: IActivitiesEnvelope = await agent.Activities.list(
        this.axiosParams
      );
      const { activities, activityCount } = activitiesEnvelope;

      runInAction('loading activities', () => {
        activities.forEach((activity: IActivity) => {
          this.activityRegistry.set(
            activity.id,
            setActivityProps(activity, this.rootStore.userStore.user)
          );
        });
        this.activityCount = activityCount;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction('finishing loading activities', () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string): Promise<IActivity> => {
    let selectedActivity = this.getActivity(id);

    if (selectedActivity) {
      this.activity = selectedActivity;
    } else {
      this.loadingInitial = true;
      try {
        selectedActivity = await agent.Activities.details(id);
        runInAction('getting activity', () => {
          this.activity = setActivityProps(
            selectedActivity!,
            this.rootStore.userStore.user
          );
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
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.comments = [];
      activity.attendees = attendees;
      activity.isHost = true;

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

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = false;

    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
      });
    } catch (error) {
      toast.error('Problem signing up to activity');
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            (attendee: IAttendee) =>
              attendee.username !== this.rootStore.userStore.user!.username
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
      });
    } catch (error) {
      toast.error('Problem cancelling attendance');
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection!.state))
      .then(() => {
        console.log('Attempting to join group');
        this.hubConnection!.invoke('AddToGroup', activityId);
      })
      .catch(error => console.error('Error establishing connection: ', error));

    this.hubConnection.on('ReceiveComment', (comment: IComment) => {
      runInAction(() => {
        this.activity!.comments.push(comment);
      });
    });

    this.hubConnection.on('Send', message => {
      //TODO: Remove when goes to production
      //toast.info(message);
    });
  };

  @action stopHubConnection = () => {
    this.hubConnection!.invoke('RemoveFromGroup', this.activity!.id)
      .then(() => {
        this.hubConnection!.stop();
      })
      .catch(error => console.error(error));
  };

  // TODO: Type properly
  @action addComment = async (values: any) => {
    console.log(values);
    values.activityId = this.activity!.id;
    try {
      await this.hubConnection!.invoke('SendComment', values);
    } catch (error) {}
  };

  @action setPage = (page: number) => {
    this.page = page;
  };

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();

    if (predicate !== 'all') {
      this.predicate.set(predicate, value);
    }
  };
}
