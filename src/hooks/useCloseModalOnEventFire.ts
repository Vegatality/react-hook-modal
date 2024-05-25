'use client';

import { DependencyList, useEffect } from 'react';

import { CloseModal, ModalInfoManageMap } from '../interface';
import { setCloseOnMouseDown } from '../utils/closeModalOnMouseDown';
import { setCloseOnESC } from '../utils/closeModalOnESC';

interface UseCloseModalOnMouseDownParam {
  modalInfoManageMap: ModalInfoManageMap;
  closeWithModalKeyImpl: CloseModal;
  dependencyList?: DependencyList;
}

export const useCloseModalOnEventFire = ({
  modalInfoManageMap,
  closeWithModalKeyImpl,
  dependencyList = [],
}: UseCloseModalOnMouseDownParam) => {
  useEffect(() => {
    const closeOnMouseDown = setCloseOnMouseDown({ modalInfoManageMap, closeWithModalKeyImpl });
    const closeOnESC = setCloseOnESC({ modalInfoManageMap, closeWithModalKeyImpl });

    document.addEventListener('mousedown', closeOnMouseDown);
    document.addEventListener('keydown', closeOnESC);

    return () => {
      document.removeEventListener('mousedown', closeOnMouseDown);
      document.removeEventListener('keydown', closeOnESC);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyList);
};
