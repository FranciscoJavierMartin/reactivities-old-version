import { RootStore } from './rootStore';
import { observable, action } from 'mobx';

interface IModal {
  open: boolean;
  body: React.ReactNode;
}

export default class ModalStore {
  constructor(private rootStore: RootStore) {}

  @observable.shallow modal: IModal = {
    open: false,
    body: null
  }

  // TODO: Change type for React node
  @action openModal = (content: React.ReactNode) => {
    this.modal.open = true;
    this.modal.body = content;
  }

  @action closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  }
}
