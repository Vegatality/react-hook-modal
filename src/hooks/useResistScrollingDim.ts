'use client';

import { DependencyList, useEffect } from 'react';

import { ModalInfoManageMap } from '../interface';

interface UseResistScrollingDimParam {
  modalInfoManageMap: ModalInfoManageMap;
  dependencyList?: DependencyList;
}

/**
 * @see https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
 */
export const useResistScrollingDim = ({ modalInfoManageMap, dependencyList = [] }: UseResistScrollingDimParam) => {
  useEffect(() => {
    // Do not set fixed position if there are no modals.
    if (modalInfoManageMap.size === 0) {
      return;
    }

    // Iterate through modalInfoManageMap, and if there isn't at least one modal where scrollable option  (default is false) is false, do not set fixed position.
    // If there is at least one modal with scrollable set to false, set fixed position.
    if (
      !Array.from(modalInfoManageMap.values()).some(
        (managedModalInfo) => managedModalInfo.options?.scrollable === false,
      )
    ) {
      return;
    }

    document.body.style.top = `-${window.scrollY}px`;
    const scrollY = document.documentElement.scrollTop;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyList);
};
