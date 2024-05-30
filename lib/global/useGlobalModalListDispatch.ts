'use client';

import { createContext, useContext } from 'react';
import { IGlobalModalListDispatchContext, IGlobalModalListStateContext } from '../interface';

export const GlobalModalListDispatchContext = createContext<IGlobalModalListDispatchContext | null>(null);
export const GlobalModalListStateContext = createContext<IGlobalModalListStateContext[]>([]);

export const useGlobalModalListDispatch = () => {
  const context = useContext(GlobalModalListDispatchContext);

  if (context === null) {
    throw new Error('useGlobalModalListDispatch should be within GlobalModalListProvider');
  }

  return context;
};

export const useGlobalModalListState = () => {
  const context = useContext(GlobalModalListStateContext);

  return context;
};
