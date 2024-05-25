import { CloseModal, ModalInfoManageMap } from '../interface';

interface SetCloseOnMouseDownPraram {
  modalInfoManageMap: ModalInfoManageMap;
  closeWithModalKeyImpl: CloseModal;
}

export const setCloseOnMouseDown = ({ modalInfoManageMap, closeWithModalKeyImpl }: SetCloseOnMouseDownPraram) => {
  const closeOnMouseDown = (e: MouseEvent) => {
    if (modalInfoManageMap.size === 0) {
      return;
    }

    for (let i = modalInfoManageMap.size - 1; i >= 0; i--) {
      const modalKey = Array.from(modalInfoManageMap.keys())[i];
      const { options, modalRef } = modalInfoManageMap.get(modalKey) || {};

      if (modalKey.length === 0) {
        continue;
      }

      if (
        options?.resistBackgroundClick === true ||
        (Array.isArray(options?.resistBackgroundClick) && // TODO: must be structural key
          options.resistBackgroundClick.some((persistKey: string) =>
            modalInfoManageMap.has(JSON.stringify([persistKey])),
          ))
      ) {
        continue;
      }

      // close the last modal if the modal is not persist and the click is outside of the modal
      if (modalRef && e.target && modalRef.contains(e.target as Node)) {
        closeWithModalKeyImpl({ modalKey });
        return;
      }
    }
  };

  return closeOnMouseDown;
};
