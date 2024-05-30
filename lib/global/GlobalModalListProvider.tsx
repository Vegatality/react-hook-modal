'use client';

import { useMemo, useRef, useState } from 'react';
import { useCloseModalOnEventFire } from '../hooks/useCloseModalOnEventFire';
import { useResistScrollingDim } from '../hooks/useResistScrollingDim';
import { useWatch } from '../hooks/useWatch';
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
import { closeModalImpl, destroyModalImpl, openModalImpl } from '../utils/modalCoreUtils';
import { GlobalModalListDispatchContext, GlobalModalListStateContext } from './useGlobalModalListDispatch';

export const GlobalModalListProvider = ({ children, modalCountLimit, mode }: GlobalModalListProviderProps) => {
  const initialLimitsRef = useRef<number | null>(modalCountLimit ?? null);
  const globalModalInfoManageMapRef = useRef<ModalInfoManageMap>(new Map());
  const [openedGlobalModalList, setOpenedGlobalModalList] = useState<OpenedModalState[]>([]);

  const watchGlobalModal: Watch = useWatch({
    modalInfoManageMapRefCurrent: globalModalInfoManageMapRef.current,
    openedModalList: openedGlobalModalList,
  });

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

  const openGlobalModal: OpenModal = ({ options, ...restOpenGlobalModalParam }) => {
    openModalImpl({
      modalCountLimit: initialLimitsRef.current,
      modalInfoManageMap: globalModalInfoManageMapRef.current,
      openedModalList: openedGlobalModalList,
      setOpenedModalList: setOpenedGlobalModalList,
      options: { ...mode, ...options },
      ...restOpenGlobalModalParam,
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
