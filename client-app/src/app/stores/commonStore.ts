import { RootStore } from './rootStore';
import { observable, action, reaction } from 'mobx';
import { JWT_LOCALSTORAGE } from '../constants/common';

export default class CommonStore {
  constructor(private rootStore: RootStore) {
    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem(JWT_LOCALSTORAGE, token);
        } else {
          window.localStorage.removeItem(JWT_LOCALSTORAGE);
        }
      }
    );
  }

  @observable token: string | null = window.localStorage.getItem(JWT_LOCALSTORAGE);
  @observable appLoaded: boolean = false;

  @action setToken = (token: string | null): void => {
    this.token = token;
  };

  @action setAppLoaded = (): void => {
    this.appLoaded = true;
  };
}
