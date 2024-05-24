'use client';

import { RefCallback, useRef, useState } from 'react';
import {
  CloseModal,
  Destroy,
  ModalCallback,
  ModalInfoManageMap,
  ModalKey,
  ModalRef,
  OpenModal,
  OpenedModalState,
  SetModalRef,
  StringifiedModalKey,
  UseModalList,
  Watch,
} from '../interface';
import { useCloseModalOnMouseDown } from '../hooks/useCloseModalOnMouseDown';
import { usePersistScrollingDim } from '../hooks/usePersistScrollingDim';

export const useModalList: UseModalList = (useModalListParam = {}) => {
  const { modalCountLimit } = useModalListParam;
  const initialLimitsRef = useRef<number | null>(modalCountLimit ?? null);
  const modalInfoManageMapRef = useRef<ModalInfoManageMap>(new Map());
  const [openedModalList, setOpenedModalList] = useState<OpenedModalState[]>([]);

  const watch: Watch = ({ modalKey }) => {
    return modalInfoManageMapRef.current.get(typeof modalKey === 'string' ? modalKey : JSON.stringify(modalKey));
  };

  const destroy: Destroy = async () => {
    queueMicrotask(() => {
      modalInfoManageMapRef.current.clear();
      setOpenedModalList([]);
    });
  };

  const changeModalCountLimit = (newLimits: number) => {
    initialLimitsRef.current = newLimits;
  };

  const setCustomModalRef: SetModalRef = ({ ModalComponent, modalKey, options, randomUniqueKey }) => {
    const stringifiedModalKey: StringifiedModalKey = JSON.stringify(modalKey);

    const customModalRef: RefCallback<HTMLElement> = <T extends HTMLElement | null>(node: T) => {
      if (node) {
        const optionsRemappedWithDefaultValue: OpenedModalState['options'] = options
          ? { scrollable: false, ...options } // override default values with the options passed
          : options;
        modalInfoManageMapRef.current.set(stringifiedModalKey, {
          modalKey: stringifiedModalKey,
          ModalComponent,
          options: optionsRemappedWithDefaultValue,
          modalRef: node,
          randomUniqueKey,
        });
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
    Object.defineProperty(customModalRef, 'current', {
      configurable: false,
      enumerable: false,
      get: () => watch({ modalKey }),
    });

    return customModalRef as ModalRef;
  };

  const closeModal: CloseModal = async ({ modalKey }) => {
    const stringifiedModalKey: StringifiedModalKey = typeof modalKey === 'string' ? modalKey : JSON.stringify(modalKey);
    queueMicrotask(() => {
      setOpenedModalList((prev) => {
        return prev.filter((modal) => modal.modalKey !== stringifiedModalKey);
      });
      const removalResult = modalInfoManageMapRef.current.delete(stringifiedModalKey);

      if (!removalResult) {
        console.error(
          `Failed to remove a modal with key: ${stringifiedModalKey}.\nThis error occurs because the modal has already been removed or the modal key is invalid.\nPlease check your modal key.\nBtw, this error is not critical and will not stop the application.`,
        );
      }
    });
  };

  const handleCloseModal =
    ({ modalKey, onClose }: { modalKey: ModalKey; onClose: ModalCallback['onClose'] }) =>
    async () => {
      await closeModal({ modalKey });

      if (typeof onClose === 'function') {
        onClose();
      }
    };

  const handleSubmitModal =
    ({ modalKey, onSubmit }: { modalKey: ModalKey; onSubmit: ModalCallback['onSubmit'] }) =>
    async (e?: React.BaseSyntheticEvent) => {
      if (e) {
        e.preventDefault?.();
        e.persist?.();
      }

      await closeModal({ modalKey });

      if (typeof onSubmit === 'function') {
        onSubmit();
      }
    };

  const openModal: OpenModal = ({ ModalComponent, modalKey, modalProps, options }) => {
    if (typeof initialLimitsRef.current === 'number' && openedModalList.length >= initialLimitsRef.current) {
      throw new Error(
        `The number of modals has reached the limit of ${initialLimitsRef.current}.\nPlease close the modal before opening a new one.`,
      );
    }

    const randomUniqueKey = crypto.randomUUID();
    const stringifiedModalKey: StringifiedModalKey = JSON.stringify(modalKey);
    const modalRef: ReturnType<SetModalRef> = setCustomModalRef({
      ModalComponent,
      modalKey,
      options,
      randomUniqueKey,
    });

    setOpenedModalList((prev) => [
      ...prev,
      {
        modalKey: stringifiedModalKey,
        randomUniqueKey,
        modalRef,
        modalProps: {
          ...modalProps,
          closeModal: handleCloseModal({ modalKey, onClose: modalProps.onClose }),
          submitModal: handleSubmitModal({ modalKey, onSubmit: modalProps.onSubmit }),
        },
        options,
        ModalComponent,
      },
    ]);
  };

  const ModalComponentList = () => {
    return openedModalList.map(({ modalKey, modalRef, modalProps, ModalComponent, randomUniqueKey }) => {
      return (
        <ModalComponent
          key={randomUniqueKey}
          {...modalProps}
          stringifiedCurrentModalKey={modalKey}
          modalRef={modalRef}
        />
      );
    });
  };

  // options
  useCloseModalOnMouseDown({ modalInfoManageMap: modalInfoManageMapRef.current, closeWithModalKeyImpl: closeModal });
  usePersistScrollingDim({ modalInfoManageMap: modalInfoManageMapRef.current, dependencyList: [openedModalList] });

  return { watch, destroy, changeModalCountLimit, openModal, closeModal, ModalComponentList };
};
