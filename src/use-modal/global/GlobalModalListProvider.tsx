import { useMemo, useRef, useState } from 'react';
import {
  CloseModal,
  Destroy,
  GlobalModalListProviderProps,
  IGlobalModalListDispatchContext,
  ModalCallback,
  ModalInfoManageMap,
  ModalKey,
  ModalRef,
  OpenModal,
  OpenedModalState,
  SetModalRef,
  StringifiedModalKey,
  Watch,
} from '../interface';
import { GlobalModalListDispatchContext, GlobalModalListStateContext } from './useGlobalModalListDispatch';
import { useCloseModalOnMouseDown } from '../hooks/useCloseModalOnMouseDown';
import { usePersistScrollingDim } from '../hooks/usePersistScrollingDim';

export const GlobalModalListProvider = ({ children, modalCountLimit }: GlobalModalListProviderProps) => {
  const initialLimitsRef = useRef<number | null>(modalCountLimit ?? null);
  const globalModalInfoManageMapRef = useRef<ModalInfoManageMap>(new Map());
  const [openedGlobalModalList, setOpenedGlobalModalList] = useState<OpenedModalState[]>([]);

  const watchGlobalModal: Watch = ({ modalKey }) => {
    return globalModalInfoManageMapRef.current.get(typeof modalKey === 'string' ? modalKey : JSON.stringify(modalKey));
  };

  const destroyGlobalModal: Destroy = async () => {
    queueMicrotask(() => {
      globalModalInfoManageMapRef.current.clear();
      setOpenedGlobalModalList([]);
    });
  };

  const changeGlobalModalCountLimit = (newLimits: number) => {
    initialLimitsRef.current = newLimits;
  };

  const setCustomGlobalModalRef: SetModalRef = ({ ModalComponent, modalKey, options, randomUniqueKey }) => {
    const stringifiedModalKey = JSON.stringify(modalKey);

    const customGlobalModalRef = <T extends HTMLElement | null>(node: T) => {
      if (node) {
        const optionsRemappedWithDefaultValue: OpenedModalState['options'] = options
          ? { scrollable: false, ...options } // override default values with the options passed
          : options;
        globalModalInfoManageMapRef.current.set(stringifiedModalKey, {
          modalKey: stringifiedModalKey,
          randomUniqueKey,
          ModalComponent,
          options: optionsRemappedWithDefaultValue,
          modalRef: node,
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
    Object.defineProperty(customGlobalModalRef, 'current', {
      configurable: false,
      enumerable: false,
      get: () => watchGlobalModal({ modalKey }),
    });

    return customGlobalModalRef as ModalRef;
  };

  const closeGlobalModal: CloseModal = async ({ modalKey }) => {
    const stringifiedModalKey = typeof modalKey === 'string' ? modalKey : JSON.stringify(modalKey);

    queueMicrotask(() => {
      setOpenedGlobalModalList((prev) => {
        return prev.filter(({ modalKey }) => modalKey !== stringifiedModalKey);
      });
    });
  };

  const handleCloseModal =
    ({ modalKey, onClose }: { modalKey: ModalKey; onClose: ModalCallback['onClose'] }) =>
    async () => {
      await closeGlobalModal({ modalKey });

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

      await closeGlobalModal({ modalKey });

      if (typeof onSubmit === 'function') {
        onSubmit();
      }
    };

  const openGlobalModal: OpenModal = ({ modalKey, ModalComponent, modalProps, options }) => {
    if (typeof initialLimitsRef.current === 'number' && openedGlobalModalList.length >= initialLimitsRef.current) {
      throw new Error(
        `The number of global modals has reached the limit of ${initialLimitsRef.current}.\nPlease close the modal before opening a new one.`,
      );
    }

    const randomUniqueKey = crypto.randomUUID();
    const stringifiedModalKey: StringifiedModalKey = JSON.stringify(modalKey);
    const modalRef: ReturnType<SetModalRef> = setCustomGlobalModalRef({
      ModalComponent,
      modalKey,
      options,
      randomUniqueKey,
    });

    setOpenedGlobalModalList((prev) => [
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

  const dispatch: IGlobalModalListDispatchContext = useMemo(
    () => ({
      closeGlobalModal,
      destroyGlobalModal,
      openGlobalModal,
      watchGlobalModal,
      changeGlobalModalCountLimit,
    }),
    [],
  );

  // options
  useCloseModalOnMouseDown({
    modalInfoManageMap: globalModalInfoManageMapRef.current,
    closeWithModalKeyImpl: closeGlobalModal,
  });
  usePersistScrollingDim({
    modalInfoManageMap: globalModalInfoManageMapRef.current,
    dependencyList: [openedGlobalModalList],
  });

  return (
    <GlobalModalListDispatchContext.Provider value={dispatch}>
      <GlobalModalListStateContext.Provider value={openedGlobalModalList}>
        {children}
      </GlobalModalListStateContext.Provider>
    </GlobalModalListDispatchContext.Provider>
  );
};
