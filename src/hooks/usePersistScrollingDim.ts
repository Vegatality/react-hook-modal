'use client';

import { DependencyList, useEffect } from 'react';

import { ModalInfoManageMap } from '../interface';

interface UsePersistScrollingDimParam {
  modalInfoManageMap: ModalInfoManageMap;
  dependencyList?: DependencyList;
}

/**
 * @see https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
 */
export const usePersistScrollingDim = ({ modalInfoManageMap, dependencyList = [] }: UsePersistScrollingDimParam) => {
  useEffect(() => {
    // 모달이 하나도 없으면 fixed 처리하지 않음.
    if (modalInfoManageMap.size === 0) {
      return;
    }

    // modalInfoManageMap을 순회하면서 scrollable(기본값 false)이 false인 모달이 하나라도 없으면 fixed 처리하지 않음.
    // scrollable이 false인 모달이 하나라도 있으면 fixed 처리함.
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
