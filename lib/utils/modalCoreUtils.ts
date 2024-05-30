import { RefCallback } from 'react';
import {
  CloseModalImpl,
  DestroyImpl,
  GenerateModalRef,
  HandleCloseModal,
  HandleSubmitModal,
  ModalCallback,
  ModalRef,
  OpenModalImpl,
  StringifiedModalKey,
  WatchImpl,
} from '../interface';
import { generateKey } from './generateKey';

export const watchModalImpl: WatchImpl = ({ modalKey, modalInfoManageMap }) => {
  return modalInfoManageMap.get(typeof modalKey === 'string' ? modalKey : JSON.stringify(modalKey));
};

export const destroyModalImpl: DestroyImpl = async ({ modalInfoManageMap, setOpenedModalList }) => {
  queueMicrotask(() => {
    modalInfoManageMap.clear();
    setOpenedModalList([]);
  });
};

const generateModalRef: GenerateModalRef = ({
  ModalComponent,
  modalInfoManageMap,
  modalKey,
  options,
  onClose,
  onSubmit,
}) => {
  const stringifiedModalKey: StringifiedModalKey = JSON.stringify(modalKey);
  modalInfoManageMap.set(stringifiedModalKey, {
    modalKey: stringifiedModalKey,
    ModalComponent,
    options,
    modalRef: null,
    onClose,
    onSubmit,
  });

  const modalRef: RefCallback<HTMLElement> = <T extends HTMLElement | null>(node: T) => {
    if (node) {
      const modalInfo = modalInfoManageMap.get(stringifiedModalKey);

      if (modalInfo) {
        modalInfo.modalRef = node;
      } else {
        console.error(
          `Failed to set a modal ref with key: ${stringifiedModalKey}.\nThis error occurs because the modal has already been removed or the modal key is invalid.\nPlease check your modal key.\nBtw, this error is not critical and will not stop the application.`,
        );
      }
    }
  };

  /**
   * @access getter
   *
   * TODO: getter/setter 타입 정의 지원하면 주석 해제. 아니면 class로 변경
   * {@link ModalRef} 지원하면 타입 수정
   * @see https://github.com/microsoft/TypeScript/issues/2521
   * @see https://github.com/microsoft/TypeScript/issues/43662
   */
  Object.defineProperty(modalRef, 'current', {
    configurable: false,
    enumerable: false,
    get: () => watchModalImpl({ modalKey, modalInfoManageMap }),
  });

  return modalRef as ModalRef;
};

export const closeModalImpl: CloseModalImpl = async ({ modalKey, modalInfoManageMap, setOpenedModalList }) => {
  const stringifiedModalKey: StringifiedModalKey = typeof modalKey === 'string' ? modalKey : JSON.stringify(modalKey);

  return new Promise<ModalCallback>((resolve) => {
    queueMicrotask(() => {
      setOpenedModalList((prev) => {
        return prev.filter((modal) => modal.modalKey !== stringifiedModalKey);
      });
      const { onClose, onSubmit } = modalInfoManageMap.get(stringifiedModalKey) ?? {};
      resolve({ onClose, onSubmit });
      const removalResult = modalInfoManageMap.delete(stringifiedModalKey);

      if (!removalResult) {
        console.error(
          `Failed to remove a modal with key: ${stringifiedModalKey}.\nThis error occurs because the modal has already been removed or the modal key is invalid.\nPlease check your modal key.\nBtw, this error is not critical and will not stop the application.`,
        );
      }
    });
  });
};

const handleCloseModal: HandleCloseModal =
  ({ modalInfoManageMap, modalKey, setOpenedModalList }) =>
  async () => {
    const { onClose } = await closeModalImpl({ modalKey, modalInfoManageMap, setOpenedModalList });

    if (typeof onClose === 'function') {
      onClose();
    }
  };

const handleSubmitModal: HandleSubmitModal =
  ({ modalInfoManageMap, modalKey, setOpenedModalList }) =>
  async (e) => {
    if (e) {
      e.preventDefault?.();
      e.persist?.();
    }

    const { onSubmit } = await closeModalImpl({ modalKey, modalInfoManageMap, setOpenedModalList });

    if (typeof onSubmit === 'function') {
      onSubmit();
    }
  };

export const openModalImpl: OpenModalImpl = ({
  ModalComponent,
  modalCountLimit,
  modalKey,
  modalProps,
  openedModalList,
  options,
  modalInfoManageMap,
  setOpenedModalList,
}) => {
  if (typeof modalCountLimit === 'number' && openedModalList.length >= modalCountLimit) {
    throw new Error(
      `The number of modals has reached the limit of ${modalCountLimit}.\nPlease close the modal before opening a new one.`,
    );
  }

  if (modalKey.length === 0 || modalKey.find((key) => key.length === 0)) {
    throw new Error('The modal key must not be empty and must not contain an empty string.');
  }

  const modalRef: ReturnType<GenerateModalRef> = generateModalRef({
    ModalComponent,
    modalKey,
    options,
    onClose: modalProps.onClose,
    onSubmit: modalProps.onSubmit,
    modalInfoManageMap,
  });

  setOpenedModalList((prev) => [
    ...prev,
    {
      modalKey: JSON.stringify(modalKey),
      internalUniqueKey: generateKey(),
      modalRef,
      modalProps: {
        ...modalProps,
        closeModal: handleCloseModal({
          modalKey,
          modalInfoManageMap,
          setOpenedModalList,
        }),
        submitModal: handleSubmitModal({
          modalKey,
          modalInfoManageMap,
          setOpenedModalList,
        }),
      },
      options,
      ModalComponent,
    },
  ]);
};