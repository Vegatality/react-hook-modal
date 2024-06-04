'use client';

import { useMemo } from 'react';
import { useCloseModalOnEventFire } from '../hooks/useCloseModalOnEventFire';
import { useGenerateModalAPI } from '../hooks/useGenerateModalAPI';
import { useResistScrollingDim } from '../hooks/useResistScrollingDim';
import { GlobalModalListProviderProps, IGlobalModalListDispatchContext } from '../interface';
import { GlobalModalListDispatchContext, GlobalModalListStateContext } from './useGlobalModalListDispatch';

export const GlobalModalListProvider = ({ children, modalCountLimit, mode }: GlobalModalListProviderProps) => {
  const { changeModalCountLimit, closeModal, destroy, modalInfoManageMap, openModal, openedModalList, watch } =
    useGenerateModalAPI({
      modalCountLimit,
      mode,
    });

  const dispatch: IGlobalModalListDispatchContext = useMemo(
    () => ({
      closeGlobalModal: closeModal,
      destroyGlobalModal: destroy,
      openGlobalModal: openModal,
      watchGlobalModal: watch,
      changeGlobalModalCountLimit: changeModalCountLimit,
    }),
    [openedModalList],
  );

  useCloseModalOnEventFire({
    modalInfoManageMap,
    closeModal,
  });
  useResistScrollingDim({
    modalInfoManageMap,
    dependencyList: [openedModalList],
  });

  return (
    <GlobalModalListDispatchContext.Provider value={dispatch}>
      <GlobalModalListStateContext.Provider value={openedModalList}>{children}</GlobalModalListStateContext.Provider>
    </GlobalModalListDispatchContext.Provider>
  );
};
