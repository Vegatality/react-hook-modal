import { PropsWithChildren } from 'react';
import {
  ChangeModalCountLimit,
  CloseModal,
  Destroy,
  OpenModal,
  OpenedModalState,
  UseModalListOptions,
  Watch,
} from './core';

export interface IGlobalModalListDispatchContext {
  openGlobalModal: OpenModal;
  closeGlobalModal: CloseModal;
  watchGlobalModal: Watch;
  destroyGlobalModal: Destroy;
  changeGlobalModalCountLimit: ChangeModalCountLimit;
}

export interface IGlobalModalListStateContext extends OpenedModalState {}

export interface GlobalModalListProviderProps extends PropsWithChildren<UseModalListOptions> {}