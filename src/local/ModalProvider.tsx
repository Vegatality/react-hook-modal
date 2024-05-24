import { PropsWithChildren } from 'react';
import { ModalProviderContext } from './useModalContext';
import { UseModalListReturn } from '../interface';

interface ModalProviderProps extends PropsWithChildren<UseModalListReturn> {}

export const ModalProvider = (modalProviderProps: ModalProviderProps) => {
  return (
    <ModalProviderContext.Provider value={modalProviderProps}>
      {modalProviderProps.children}
    </ModalProviderContext.Provider>
  );
};
