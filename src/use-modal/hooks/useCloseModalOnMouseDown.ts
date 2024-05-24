'use client';

import { DependencyList, useEffect } from 'react';

import type { CloseModal, ModalInfoManageMap } from '../interface';

interface UseCloseModalOnMouseDownParam {
  modalInfoManageMap: ModalInfoManageMap;
  closeWithModalKeyImpl: CloseModal;
  dependencyList?: DependencyList;
}

export const useCloseModalOnMouseDown = ({
  modalInfoManageMap,
  closeWithModalKeyImpl,
  dependencyList = [],
}: UseCloseModalOnMouseDownParam) => {
  useEffect(() => {
    const closeOnMouseDown = (e: MouseEvent) => {
      if (modalInfoManageMap.size === 0) {
        return;
      }

      modalInfoManageMap.forEach(({ options, modalRef }, modalKey, modalMap) => {
        if (modalKey.length === 0) {
          return;
        }

        if (
          options?.persist === true ||
          (Array.isArray(options?.persist) && modalMap.has(JSON.stringify(options.persist)))
        ) {
          return;
        }

        if (modalRef && e.target && modalRef.contains(e.target as Node)) {
          closeWithModalKeyImpl({ modalKey });
        }
      });
    };

    document.addEventListener('mousedown', closeOnMouseDown);

    return () => {
      document.removeEventListener('mousedown', closeOnMouseDown);
    };
  }, dependencyList);
};
