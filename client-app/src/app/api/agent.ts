import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { IActivity } from '../models/activity';
import { history } from '../..';
import { NOT_FOUND_ROUTE, ACTIVITIES_ROUTE, ATTEND_ROUTE } from '../constants/routes';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';
import { JWT_LOCALSTORAGE } from '../constants/common';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = window.localStorage.getItem(JWT_LOCALSTORAGE);

  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use(undefined, error => {
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Network error - make sure API is running');
  } else {
    const { status, data, config } = error.response;

    if (status === 404) {
      history.push(`/${NOT_FOUND_ROUTE}`);
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

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>(resolve =>
    setTimeout(() => resolve(response), ms)
  );

const request = {
  get: (url: string) =>
    axios
      .get(url)
      .then(sleep(1000))
      .then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody)
};

const Activities = {
  list: (): Promise<IActivity[]> => request.get('/activities'),
  details: (id: string) => request.get(`/activities/${id}`),
  create: (activity: IActivity) => request.post('/activities', activity),
  update: (activity: IActivity) =>
    request.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => request.del(`/activities/${id}`),
  attend: (id: string) => request.post(`/${ACTIVITIES_ROUTE}/${id}/${ATTEND_ROUTE}`,{}),
  unattend: (id: string) => request.del(`/${ACTIVITIES_ROUTE}/${id}/${ATTEND_ROUTE}`),
};

const User = {
  current: (): Promise<IUser> => request.get('/user'),
  login: (user: IUserFormValues): Promise<IUser> =>
    request.post(`/user/login`, user),
  register: (user: IUserFormValues): Promise<IUser> =>
    request.post(`/user/register`, user)
};
export default {
  Activities,
  User,
};
