'use client';

import { createContext, useContext } from 'react';
import { UseModalListReturn } from '../interface';

interface ModalProviderContext extends UseModalListReturn {}

export const ModalProviderContext = createContext<ModalProviderContext | null>(null);

export const useModalContext = () => {
  const modalContext = useContext(ModalProviderContext);

  if (modalContext === null) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }

  return modalContext;
};
