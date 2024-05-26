'use client';

import { useRef, useState } from 'react';
import { useCloseModalOnEventFire } from '../hooks/useCloseModalOnEventFire';
import { useResistScrollingDim } from '../hooks/useResistScrollingDim';
import {
  ChangeModalCountLimit,
  CloseModal,
  Destroy,
  ModalInfoManageMap,
  OpenModal,
  OpenedModalState,
  UseModalList,
  Watch,
} from '../interface';
import { closeModalImpl, destroyModalImpl, openModalImpl, watchModalImpl } from '../utils/modalCoreUtils';

export const useModalList: UseModalList = (useModalListParam = {}) => {
  const { modalCountLimit } = useModalListParam;
  const initialLimitsRef = useRef<number | null>(modalCountLimit ?? null);
  const modalInfoManageMapRef = useRef<ModalInfoManageMap>(new Map());
  const [openedModalList, setOpenedModalList] = useState<OpenedModalState[]>([]);

  const watch: Watch = ({ modalKey }) =>
    watchModalImpl({ modalKey, modalInfoManageMap: modalInfoManageMapRef.current });

  const destroy: Destroy = async () =>
    destroyModalImpl({ modalInfoManageMap: modalInfoManageMapRef.current, setOpenedModalList });

  const changeModalCountLimit: ChangeModalCountLimit = (newLimits) => {
    initialLimitsRef.current = newLimits;
  };

  const closeModal: CloseModal = async ({ modalKey }) => {
    const { onClose } = await closeModalImpl({
      modalKey,
      modalInfoManageMap: modalInfoManageMapRef.current,
      setOpenedModalList,
    });

    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const openModal: OpenModal = (openModalParam) => {
    openModalImpl({
      modalCountLimit: initialLimitsRef.current,
      modalInfoManageMap: modalInfoManageMapRef.current,
      openedModalList,
      setOpenedModalList,
      ...openModalParam,
    });
  };

  const ModalComponentList = () => {
    return openedModalList.map(({ modalKey, modalRef, modalProps, ModalComponent, internalUniqueKey }) => {
      return (
        <ModalComponent
          key={internalUniqueKey}
          {...modalProps}
          stringifiedCurrentModalKey={modalKey}
          modalRef={modalRef}
        />
      );
    });
  };

  // options
  useCloseModalOnEventFire({ modalInfoManageMap: modalInfoManageMapRef.current, closeWithModalKeyImpl: closeModal });
  useResistScrollingDim({ modalInfoManageMap: modalInfoManageMapRef.current, dependencyList: [openedModalList] });

  return { watch, destroy, changeModalCountLimit, openModal, closeModal, ModalComponentList };
};
