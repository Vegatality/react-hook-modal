'use client';

import { PropsWithChildren } from 'react';
import { ModalProviderContext } from './useModalContext';
import { UseModalListReturn } from '../interface';

interface ModalProviderProps extends PropsWithChildren<UseModalListReturn> {}

export const ModalProvider = ({ children, ...restModalAPI }: ModalProviderProps) => {
  return <ModalProviderContext.Provider value={restModalAPI}>{children}</ModalProviderContext.Provider>;
};
