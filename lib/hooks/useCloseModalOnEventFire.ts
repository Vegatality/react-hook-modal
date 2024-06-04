'use client';

import { DependencyList, useEffect } from 'react';

import { CloseModal, ModalInfoManageMap } from '../interface';
import { setCloseOnESC } from '../utils/closeModalOnESC';
import { setCloseOnMouseDown } from '../utils/closeModalOnMouseDown';

interface UseCloseModalOnMouseDownParam {
  modalInfoManageMap: ModalInfoManageMap;
  closeModal: CloseModal;
  dependencyList?: DependencyList;
}

export const useCloseModalOnEventFire = ({
  modalInfoManageMap,
  closeModal,
  dependencyList = [],
}: UseCloseModalOnMouseDownParam) => {
  useEffect(() => {
    const closeOnMouseDown = setCloseOnMouseDown({
      modalInfoManageMap,
      closeModal,
    });
    const closeOnESC = setCloseOnESC({ modalInfoManageMap, closeModal });

    document.addEventListener('mousedown', closeOnMouseDown);
    document.addEventListener('keydown', closeOnESC);

    return () => {
      document.removeEventListener('mousedown', closeOnMouseDown);
      document.removeEventListener('keydown', closeOnESC);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyList);
};
