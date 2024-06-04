'use client';

import { useGlobalModalListState } from './useGlobalModalListDispatch';

export const GlobalModalList = () => {
  const globalModalListState = useGlobalModalListState();

  return globalModalListState.length
    ? globalModalListState.map(({ ModalComponent, modalKey, modalProps, modalRef, internalUniqueKey }) => (
        <ModalComponent key={internalUniqueKey} {...modalProps} currentModalKey={modalKey} modalRef={modalRef} />
      ))
    : null;
};
