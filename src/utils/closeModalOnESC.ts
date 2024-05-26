import { CloseModal, ModalInfoManageMap } from '../interface';

interface SetCloseOnESCParam {
  modalInfoManageMap: ModalInfoManageMap;
  closeWithModalKeyImpl: CloseModal;
}

export const setCloseOnESC = ({ modalInfoManageMap, closeWithModalKeyImpl }: SetCloseOnESCParam) => {
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
        options?.resistESC === true ||
        (Array.isArray(options?.resistESC) && // TODO: must be structural key
          options?.resistESC.some((resistKey: string) => modalInfoManageMap.has(JSON.stringify([resistKey]))))
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

  return closeOnESC;
};
