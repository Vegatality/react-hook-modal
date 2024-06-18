import { PropsWithChildren } from 'react';
import {
  ChangeModalCountLimit,
  ChangeModalOptions,
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
  /**
   * ## DO NOT USE THIS IN DEPENDENCY ARRAY OF `useEffect`.
   * - destroyGlobalModal doesn't execute modal onClose/onSubmit callbacks.
   */
  destroyGlobalModal: Destroy;
  changeGlobalModalCountLimit: ChangeModalCountLimit;
  changeGlobalModalOptions: ChangeModalOptions;
}

export interface IGlobalModalListStateContext extends OpenedModalState {}

export interface GlobalModalListProviderProps extends PropsWithChildren<UseModalListOptions> {}
