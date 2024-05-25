import { DependencyList, useEffect } from 'react';
import { CloseModal, ModalInfoManageMap } from '../interface';

interface UseCloseModalOnESCParam {
  modalInfoManageMap: ModalInfoManageMap;
  closeWithModalKeyImpl: CloseModal;
  dependencyList?: DependencyList;
}

export const useCloseModalOnESC = ({
  modalInfoManageMap,
  closeWithModalKeyImpl,
  dependencyList = [],
}: UseCloseModalOnESCParam) => {
  useEffect(() => {
    const closeOnESC = (e: KeyboardEvent) => {
      if (modalInfoManageMap.size === 0) {
        return;
      }

      for (let i = modalInfoManageMap.size - 1; i >= 0; i--) {
        const modalKey = Array.from(modalInfoManageMap.keys())[i];
        const { options } = modalInfoManageMap.get(modalKey) || {};

        if (modalKey.length === 0) {
          continue;
        }

        if (
          options?.resistBackgroundClick === true ||
          (Array.isArray(options?.resistBackgroundClick) && // TODO: must be structural key
            options.resistBackgroundClick.some((resistKey: string) =>
              modalInfoManageMap.has(JSON.stringify([resistKey])),
            ))
        ) {
          continue;
        }

        // close the last modal if the modal is not persist and the ESC key is pressed
        if (e.key === 'Escape') {
          closeWithModalKeyImpl({ modalKey });
          return;
        }
      }
    };

    document.addEventListener('keydown', closeOnESC);

    return () => {
      document.removeEventListener('keydown', closeOnESC);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyList);
};
