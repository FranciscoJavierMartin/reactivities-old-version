import { observable, computed, action, runInAction } from 'mobx';
import { IUser, IUserFormValues } from '../models/user';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { ACTIVITIES_ROUTE, HOME_ROUTE } from '../constants/routes';
import { history } from '../../index';

export default class UserStore {

  constructor(private rootStore: RootStore){}

  @observable user: IUser | null = null;

  @computed get isLoggedIn(): boolean {
    return !!this.user;
  }

  @action getUser = async () => {
    try{
      const user = await agent.User.current();
      runInAction(() => {
        this.user = user;
      });
    } catch(error){
      
    }
  }

  @action login = async (values: IUserFormValues): Promise<void> => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push(`/${ACTIVITIES_ROUTE}`);
    } catch (error) {
      console.error(error);
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push(`/${HOME_ROUTE}`);
  }

  @action register = async (values: IUserFormValues) => {
    try{
      const user = await agent.User.register(values);
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push(`/${ACTIVITIES_ROUTE}`);
    } catch(error){
      throw error;
    }
  }
}
