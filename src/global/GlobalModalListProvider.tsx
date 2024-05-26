'use client';

import { useMemo, useRef, useState } from 'react';
import { useCloseModalOnEventFire } from '../hooks/useCloseModalOnEventFire';
import { useResistScrollingDim } from '../hooks/useResistScrollingDim';
import {
  ChangeModalCountLimit,
  CloseModal,
  Destroy,
  GlobalModalListProviderProps,
  IGlobalModalListDispatchContext,
  ModalInfoManageMap,
  OpenModal,
  OpenedModalState,
  Watch,
} from '../interface';
import { closeModalImpl, destroyModalImpl, openModalImpl, watchModalImpl } from '../utils/modalCoreUtils';
import { GlobalModalListDispatchContext, GlobalModalListStateContext } from './useGlobalModalListDispatch';

export const GlobalModalListProvider = ({ children, modalCountLimit }: GlobalModalListProviderProps) => {
  const initialLimitsRef = useRef<number | null>(modalCountLimit ?? null);
  const globalModalInfoManageMapRef = useRef<ModalInfoManageMap>(new Map());
  const [openedGlobalModalList, setOpenedGlobalModalList] = useState<OpenedModalState[]>([]);

  const watchGlobalModal: Watch = ({ modalKey }) =>
    watchModalImpl({ modalKey, modalInfoManageMap: globalModalInfoManageMapRef.current });

  const destroyGlobalModal: Destroy = async () =>
    destroyModalImpl({
      modalInfoManageMap: globalModalInfoManageMapRef.current,
      setOpenedModalList: setOpenedGlobalModalList,
    });

  const changeGlobalModalCountLimit: ChangeModalCountLimit = (newLimits) => {
    initialLimitsRef.current = newLimits;
  };

  const closeGlobalModal: CloseModal = async ({ modalKey }) => {
    const { onClose } = await closeModalImpl({
      modalKey,
      modalInfoManageMap: globalModalInfoManageMapRef.current,
      setOpenedModalList: setOpenedGlobalModalList,
    });

    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const openGlobalModal: OpenModal = (openModalParam) => {
    openModalImpl({
      modalCountLimit: initialLimitsRef.current,
      modalInfoManageMap: globalModalInfoManageMapRef.current,
      openedModalList: openedGlobalModalList,
      setOpenedModalList: setOpenedGlobalModalList,
      ...openModalParam,
    });
  };

  const dispatch: IGlobalModalListDispatchContext = useMemo(
    () => ({
      closeGlobalModal,
      destroyGlobalModal,
      openGlobalModal,
      watchGlobalModal,
      changeGlobalModalCountLimit,
    }),
    [],
  );

  // options
  useCloseModalOnEventFire({
    modalInfoManageMap: globalModalInfoManageMapRef.current,
    closeWithModalKeyImpl: closeGlobalModal,
  });
  useResistScrollingDim({
    modalInfoManageMap: globalModalInfoManageMapRef.current,
    dependencyList: [openedGlobalModalList],
  });

  return (
    <GlobalModalListDispatchContext.Provider value={dispatch}>
      <GlobalModalListStateContext.Provider value={openedGlobalModalList}>
        {children}
      </GlobalModalListStateContext.Provider>
    </GlobalModalListDispatchContext.Provider>
  );
};
