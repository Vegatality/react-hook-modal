'use client';

import { useCloseModalOnEventFire } from '../hooks/useCloseModalOnEventFire';
import { useGenerateModalAPI } from '../hooks/useGenerateModalAPI';
import { useResistScrollingDim } from '../hooks/useResistScrollingDim';
import { UseModalList } from '../interface';

export const useModalList: UseModalList = (useModalListOptions = {}) => {
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
    modalCountLimit: useModalListOptions.modalCountLimit,
    mode: useModalListOptions.mode,
  });

  const ModalComponentList = () => {
    return openedModalList.map(({ modalKey, modalRef, modalProps, ModalComponent, internalUniqueKey }) => {
      return <ModalComponent key={internalUniqueKey} {...modalProps} currentModalKey={modalKey} modalRef={modalRef} />;
    });
  };

  useCloseModalOnEventFire({
    modalInfoManageMap,
    closeModal,
    dependencyList: [forceUpdateState],
  });
  useResistScrollingDim({ modalInfoManageMap, dependencyList: [openedModalList, forceUpdateState] });

  return { watch, destroy, changeModalCountLimit, changeModalOptions, openModal, closeModal, ModalComponentList };
};
