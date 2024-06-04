import { CloseModal, ModalInfoManageMap } from '../interface';
import { hashKey } from './utils';

interface SetCloseOnESCParam {
  modalInfoManageMap: ModalInfoManageMap;
  closeModal: CloseModal;
}

export const setCloseOnESC = ({ modalInfoManageMap, closeModal }: SetCloseOnESCParam) => {
  const closeOnESC = (e: KeyboardEvent) => {
    if (modalInfoManageMap.size === 0) {
      return;
    }

    for (let i = modalInfoManageMap.size - 1; i >= 0; i--) {
      const hashedModalKey = Array.from(modalInfoManageMap.keys())[i];
      const { options, modalKey } = modalInfoManageMap.get(hashedModalKey) || {};

      if (!modalKey || hashedModalKey.length === 0) {
        throw new Error('modalKey is empty');
      }

      if (
        options?.resistESC === true ||
        (Array.isArray(options?.resistESC) &&
          options?.resistESC.some((resistKey) => modalInfoManageMap.has(hashKey(resistKey))))
      ) {
        continue;
      }

      // close the last modal if the modal is not persist and the ESC key is pressed
      if (e.key === 'Escape') {
        closeModal({ modalKey, exact: true });
        return;
      }
    }
  };

  return closeOnESC;
};
