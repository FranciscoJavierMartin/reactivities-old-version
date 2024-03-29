import { IProfile, IPhoto, IUserActivity } from './../models/profile';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { IActivity, IActivitiesEnvelope } from '../models/activity';
import { history } from '../..';
import { NOT_FOUND_ROUTE, HOME_ROUTE } from '../constants/routes';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';
import { JWT_LOCALSTORAGE } from '../constants/common';
import {
  ACTIVITIES_SERVER_ROUTE,
  ATTEND_SERVER_ROUTE,
  USER_SERVER_ROUTE,
  LOGIN_SERVER_ROUTE,
  REGISTER_SERVER_ROUTE,
  PROFILES_SERVER_ROUTE,
  PHOTOS_SERVER_ROUTE,
  SET_MAIN_SERVER_ROUTE,
  FOLLOW_SERVER_ROUTE
} from '../constants/serverRoutes';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = window.localStorage.getItem(JWT_LOCALSTORAGE);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, error => {
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Network error - make sure API is running');
  } else {
    const { status, data, config, headers } = error.response;

    if (status === 404) {
      history.push(`/${NOT_FOUND_ROUTE}`);
    } else if (
      status === 401 &&
      headers['www-authenticate'].includes(
        'Bearer error="invalid_token", error_description="The token expired at'
      )
    ) {
      window.localStorage.removeItem(JWT_LOCALSTORAGE);
      history.push(HOME_ROUTE);
      toast.info('Your session has expired, please login again');
    } else if (
      status === 400 &&
      config.method === 'get' &&
      data.errors.hasOwnProperty('id')
    ) {
      history.push(`/${NOT_FOUND_ROUTE}`);
    } else if (status === 500) {
      toast.error('Server error - check the terminal for more info');
    }
  }

  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const request = {
  get: (url: string) =>
    axios
      .get(url)
      .then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, file: Blob) => {
    const formData = new FormData();
    formData.append('File', file);
    return axios
      .post(url, formData, {
        headers: { 'Content-type': 'multipart/form-data' }
      })
      .then(responseBody);
  }
};

const Activities = {
  list: (params: URLSearchParams): Promise<IActivitiesEnvelope> =>
    axios
      .get(`/${ACTIVITIES_SERVER_ROUTE}`, { params })
      .then(responseBody),
  details: (id: string): Promise<IActivity> =>
    request.get(`/${ACTIVITIES_SERVER_ROUTE}/${id}`),
  create: (activity: IActivity): Promise<void> =>
    request.post(`/${ACTIVITIES_SERVER_ROUTE}`, activity),
  update: (activity: IActivity): Promise<void> =>
    request.put(`/${ACTIVITIES_SERVER_ROUTE}/${activity.id}`, activity),
  delete: (id: string): Promise<void> =>
    request.del(`/${ACTIVITIES_SERVER_ROUTE}/${id}`),
  attend: (id: string): Promise<void> =>
    request.post(
      `/${ACTIVITIES_SERVER_ROUTE}/${id}/${ATTEND_SERVER_ROUTE}`,
      {}
    ),
  unattend: (id: string): Promise<void> =>
    request.del(`/${ACTIVITIES_SERVER_ROUTE}/${id}/${ATTEND_SERVER_ROUTE}`)
};

const User = {
  current: (): Promise<IUser> => request.get(`/${USER_SERVER_ROUTE}`),
  login: (user: IUserFormValues): Promise<IUser> =>
    request.post(LOGIN_SERVER_ROUTE, user),
  register: (user: IUserFormValues): Promise<IUser> =>
    request.post(REGISTER_SERVER_ROUTE, user)
};

const Profiles = {
  get: (username: string): Promise<IProfile> =>
    request.get(`/${PROFILES_SERVER_ROUTE}/${username}`),
  uploadPhoto: (photo: Blob): Promise<IPhoto> =>
    request.postForm(`/${PHOTOS_SERVER_ROUTE}`, photo),
  setMainPhoto: (id: string): Promise<void> =>
    request.post(`/${PHOTOS_SERVER_ROUTE}/${id}/${SET_MAIN_SERVER_ROUTE}`, {}),
  deletePhoto: (id: string): Promise<void> =>
    request.del(`/${PHOTOS_SERVER_ROUTE}/${id}`),
  updateProfile: (profile: Partial<IProfile>): Promise<void> =>
    request.put(`/${PROFILES_SERVER_ROUTE}`, profile),
  follow: (username: string): Promise<void> =>
    request.post(`/${PROFILES_SERVER_ROUTE}/${username}/follow`, {}),
  unfollow: (username: string): Promise<void> =>
    request.del(`/${PROFILES_SERVER_ROUTE}/${username}/follow`),
  listFollowing: (username: string, predicate: string): Promise<IProfile[]> =>
    request.get(
      `/${PROFILES_SERVER_ROUTE}/${username}/${FOLLOW_SERVER_ROUTE}?predicate=${predicate}`
    ),
  listActivities: (
    username: string,
    predicate: string
  ): Promise<IUserActivity[]> =>
    request.get(
      `/${PROFILES_SERVER_ROUTE}/${username}/${ACTIVITIES_SERVER_ROUTE}?predicate=${predicate}`
    )
};

export default {
  Activities,
  User,
  Profiles
};
