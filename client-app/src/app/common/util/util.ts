import { IActivity, IAttendee } from './../../models/activity';
import { IUser } from '../../models/user';

export const combineDateAndTime = (date: Date, time: Date): Date => {
  /*const timeString = time.getHours() + ':' + time.getMinutes() + ':00';
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const dateString = `${year}-${month}-${day}`;*/
  const dateString = date.toISOString().split('T')[0];
  const timeString = time.toISOString().split('T')[1];
  return new Date(dateString + 'T' + timeString);
};

export const setActivityProps = (activity: IActivity, user: IUser | null): IActivity => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some(
    (attendee: IAttendee) => attendee.username === user?.username
  );
  activity.isHost = activity.attendees.some(
    (attendee: IAttendee) =>
      attendee.isHost && attendee.username === user?.username
  );

  return activity;
}

export const createAttendee = (user: IUser): IAttendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    username: user.username,
    image: user.image!
  }
}