'use client';

import { useMemo } from 'react';
import { useCloseModalOnEventFire } from '../hooks/useCloseModalOnEventFire';
import { useGenerateModalAPI } from '../hooks/useGenerateModalAPI';
import { useResistScrollingDim } from '../hooks/useResistScrollingDim';
import { GlobalModalListProviderProps, IGlobalModalListDispatchContext } from '../interface';
import { GlobalModalListDispatchContext, GlobalModalListStateContext } from './useGlobalModalListDispatch';

export const GlobalModalListProvider = ({ children, modalCountLimit, mode }: GlobalModalListProviderProps) => {
  const {
    changeModalCountLimit,
    closeModal,
    destroy,
    modalInfoManageMap,
    openModal,
    openedModalList,
    watch,
    changeModalOptions,
    forceUpdateState,
  } = useGenerateModalAPI({
    modalCountLimit,
    mode,
  });

  const immutableDispatchReference: Omit<IGlobalModalListDispatchContext, 'openGlobalModal' | 'watchGlobalModal'> =
    useMemo(
      () => ({
        closeGlobalModal: closeModal,
        destroyGlobalModal: destroy,
        changeGlobalModalCountLimit: changeModalCountLimit,
        changeGlobalModalOptions: changeModalOptions,
      }),
      [],
    );

  const mutableDispatchReference = useMemo(
    () => ({
      openGlobalModal: openModal,
      watchGlobalModal: watch,
    }),
    [openedModalList],
  );

  useCloseModalOnEventFire({
    modalInfoManageMap,
    closeModal,
    dependencyList: [forceUpdateState],
  });
  useResistScrollingDim({
    modalInfoManageMap,
    dependencyList: [openedModalList, forceUpdateState],
  });

  return (
    <GlobalModalListDispatchContext.Provider value={{ ...immutableDispatchReference, ...mutableDispatchReference }}>
      <GlobalModalListStateContext.Provider value={openedModalList}>{children}</GlobalModalListStateContext.Provider>
    </GlobalModalListDispatchContext.Provider>
  );
};
