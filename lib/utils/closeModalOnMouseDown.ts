import { CloseModal, DefaultMode, ModalInfoManageMap } from '../interface';
import { hashKey } from './utils';

interface SetCloseOnMouseDownParam {
  modalInfoManageMap: ModalInfoManageMap;
  defaultResistBackgroundClick?: DefaultMode['resistBackgroundClick'];
  closeModal: CloseModal;
}

/**
 * TODO: integrate with closeOnESC by one
 */
export const setCloseOnMouseDown = ({ modalInfoManageMap, closeModal }: SetCloseOnMouseDownParam) => {
  const closeOnMouseDown = (e: MouseEvent) => {
    if (modalInfoManageMap.size === 0) {
      return;
    }

    for (let i = modalInfoManageMap.size - 1; i >= 0; i--) {
      const hashedModalKey = Array.from(modalInfoManageMap.keys())[i];
      const { options, modalRef, modalKey } = modalInfoManageMap.get(hashedModalKey) || {};

      if (!modalKey || hashedModalKey.length === 0) {
        throw new Error('modalKey is empty');
      }

      if (
        options?.resistBackgroundClick === true ||
        (Array.isArray(options?.resistBackgroundClick) &&
          options.resistBackgroundClick.some((resistKey) => modalInfoManageMap.has(hashKey(resistKey))))
      ) {
        continue;
      }

      // close the last modal if the modal is not persist and the click is outside of the modal
      if (modalRef && e.target && modalRef.contains(e.target as Node)) {
        closeModal({ modalKey, exact: true });
        return;
      }

      // Do not close a modal of which resistBackgroundClick option is set to false but modalRef is nullish.
      // Because we cannot determine the boundary of a modal without modalRef.
      if (!options?.resistBackgroundClick && !modalRef) {
        return;
      }
    }
  };

  return closeOnMouseDown;
};
