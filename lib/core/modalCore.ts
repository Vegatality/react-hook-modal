import { RefCallback } from 'react';
import {
  ChangeModalCountLimit,
  CloseModal,
  CloseModalImpl,
  Destroy,
  DestroyImpl,
  GenerateModalAPI,
  GenerateModalAPIReturn,
  GenerateModalRef,
  HandleCloseModal,
  HandleSubmitModal,
  HashedModalKey,
  ModalCallback,
  ModalRef,
  OpenModal,
  OpenModalImpl,
  Watch,
  WatchImpl,
} from '../interface';
import { generateKey } from '../utils/generateKey';
import { hashKey, partialMatchKey } from '../utils/utils';

const watchModalImpl: WatchImpl = ({ modalKey, modalInfoManageMap }) => {
  return modalInfoManageMap.get(hashKey(modalKey));
};

/**
 * destroy doesn't execute modal onClose/onSubmit callbacks.
 */
const destroyModalImpl: DestroyImpl = async ({ modalInfoManageMap, setOpenedModalList }) => {
  queueMicrotask(() => {
    modalInfoManageMap.clear();
    setOpenedModalList([]);
  });
};

const generateModalRef: GenerateModalRef = ({
  ModalComponent,
  modalInfoManageMap,
  modalKey,
  hashedModalKey,
  options,
  onClose,
  onSubmit,
}) => {
  modalInfoManageMap.set(hashedModalKey, {
    modalKey,
    hashedModalKey,
    ModalComponent,
    options,
    modalRef: null,
    onClose,
    onSubmit,
  });

  const modalRef: RefCallback<HTMLElement> = <T extends HTMLElement | null>(node: T) => {
    if (node) {
      const modalInfo = modalInfoManageMap.get(hashedModalKey);

      if (modalInfo) {
        modalInfo.modalRef = node;
      } else {
        console.error(
          `Failed to set a modal ref with key: ${hashedModalKey}.\nThis error occurs because the modal has already been removed or the modal key is invalid.\nPlease check your modal key.\nBtw, this error is not critical and will not stop the application.`,
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

const notifyUnIntendedCloseException = (hashedModalKey: HashedModalKey, removalResult: boolean) => {
  if (!removalResult) {
    console.error(
      `Failed to remove a modal with key: ${hashedModalKey}.\nThis error occurs because the modal has already been removed or the modal key is invalid.\nPlease check your modal key.\nBtw, this error is not critical and will not stop the application.`,
    );
  }
};

const closeModalImpl: CloseModalImpl = async ({ modalKey, exact, modalInfoManageMap, setOpenedModalList }) => {
  const hashedModalKey: HashedModalKey = hashKey(modalKey);

  return new Promise<Array<ModalCallback>>((resolve) => {
    const modalCallbackList: Array<ModalCallback> = [];

    queueMicrotask(() => {
      if (exact) {
        setOpenedModalList((prev) => {
          return prev.filter((modal) => modal.hashedModalKey !== hashedModalKey);
        });
        const { onClose, onSubmit } = modalInfoManageMap.get(hashedModalKey) ?? {};
        modalCallbackList.push({ onClose, onSubmit });
        const removalResult = modalInfoManageMap.delete(hashedModalKey);

        notifyUnIntendedCloseException(hashedModalKey, removalResult);
      } else {
        setOpenedModalList((prev) => {
          return prev.filter((modal) => !partialMatchKey(modal.modalKey, modalKey));
        });

        for (const [key, modalQuery] of modalInfoManageMap.entries()) {
          if (partialMatchKey(modalQuery.modalKey, modalKey)) {
            const { onClose, onSubmit } = modalQuery;
            modalCallbackList.push({ onClose, onSubmit });
            const removalResult = modalInfoManageMap.delete(key);

            notifyUnIntendedCloseException(key, removalResult);
          }
        }
      }

      resolve(modalCallbackList);
    });
  });
};

const handleCloseModal: HandleCloseModal =
  ({ modalInfoManageMap, modalKey, setOpenedModalList }) =>
  async () => {
    const [{ onClose }] = await closeModalImpl({ modalKey, modalInfoManageMap, setOpenedModalList, exact: true });

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

    const [{ onSubmit }] = await closeModalImpl({ modalKey, modalInfoManageMap, setOpenedModalList, exact: true });

    if (typeof onSubmit === 'function') {
      onSubmit();
    }
  };

const openModalImpl: OpenModalImpl = ({
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

  if (modalKey.length === 0 || (typeof modalKey[0] === 'string' && modalKey[0].length === 0)) {
    throw new Error('The modal key must not be empty and must not contain an empty string.');
  }

  const hashedModalKey = hashKey(modalKey);
  // prevent duplicate modals with the same key
  if (modalInfoManageMap.has(hashedModalKey)) {
    throw new Error(`The modal with key ${JSON.stringify(modalKey)} is already open.`);
  }

  setOpenedModalList((prev) => [
    ...prev,
    {
      hashedModalKey,
      modalKey,
      internalUniqueKey: generateKey(),
      modalRef: generateModalRef({
        ModalComponent,
        modalKey,
        modalInfoManageMap,
        hashedModalKey,
        options,
        onClose: modalProps?.onClose,
        onSubmit: modalProps?.onSubmit,
      }),
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

export const generateModalAPI = ({
  modalInfoManageMap,
  openedModalList,
  modalCountLimitRef,
  mode,
  setOpenedModalList,
}: GenerateModalAPI): GenerateModalAPIReturn => {
  const watch: Watch = ({ modalKey }) => watchModalImpl({ modalKey, modalInfoManageMap });

  const destroy: Destroy = async () =>
    destroyModalImpl({
      modalInfoManageMap,
      setOpenedModalList,
    });

  const changeModalCountLimit: ChangeModalCountLimit = (newLimits) => {
    modalCountLimitRef.current = newLimits;
  };

  const closeModal: CloseModal = async ({ modalKey, exact }) => {
    const modalCallbackList = await closeModalImpl({
      modalKey,
      exact,
      modalInfoManageMap,
      setOpenedModalList,
    });

    modalCallbackList.forEach(({ onClose }) => {
      if (typeof onClose === 'function') {
        onClose();
      }
    });
  };

  const openModal: OpenModal = ({ options, ...restOpenModalProps }) => {
    openModalImpl({
      modalCountLimit: modalCountLimitRef.current,
      modalInfoManageMap,
      openedModalList,
      setOpenedModalList,
      options: { ...mode, ...options },
      ...restOpenModalProps,
    });
  };

  return {
    watch,
    destroy,
    changeModalCountLimit,
    closeModal,
    openModal,
  };
};
