'use client';

import { RefCallback, useCallback, useEffect, useRef } from 'react';

import { OpenModalOptions } from '../interface';
import { useToggle } from './useToggle';

interface IOpenModalOptions extends Omit<OpenModalOptions, 'scrollable'> {
  /**
   * #### Is the modal resistant to background clicks
   * @description
   * If the resistOnBackgroundClick option is set to true, the modal will remain open even if user clicks on the background.
   * @default false
   */
  resistBackgroundClick?: boolean;
  /**
   * #### Is the modal resistant to the ESC key
   * @description
   * If the resistOnESC option is set to true, the modal will remain open even if user presses the ESC key.
   * @default false
   */
  resistESC?: boolean;
}

interface UseToggleModalOption {
  /**
   * #### initial value of the modal
   * @default false
   */
  initialValue?: boolean;
  /**
   * #### open modal options
   */
  openModalOptions?: IOpenModalOptions;
}
interface UseToggleModalReturn<T extends HTMLElement> {
  /**
   * is Modal Open
   */
  isModalOpen: boolean;
  /**
   * modal ref
   */
  modalRef: RefCallback<T>;
  /**
   * modal toggle function
   */
  toggleModal: () => void;
}

/**
 * #### useModal Core Hook
 *
 * @description
 * You can use this hook for toggling anything, not just a modal.
 *
 * @param useToggleModalOption.initialValue - initial value of the modal
 * @default false
 *
 * @param useToggleModalOption.openModalOptions.resistOnBackgroundClick - Is the modal resistant to background clicks
 * @default false
 *
 * @param useToggleModalOption.openModalOptions.resistOnESC - Is the modal resistant to the ESC key
 * @default false
 *
 * @example
 * ```tsx
 * function App () {
 *  const { isModalOpen, modalRef, toggleModal } = useToggleModal<HTMLDivElement>({ initialValue: false, openModalOptions: { resistBackgroundClick: true } });
 *  return (
 *    <div>
 *      <button onClick={toggleModal}>Toggle Modal</button>
 *      {isModalOpen && (
 *        <div ref={modalRef}>
 *          <h1>Modal</h1>
 *          <button onClick={toggleModal}>Close Modal</button>
 *        </div>
 *      )}
 *    </div>
 *  );
 * }
 * ```
 */
const useToggleModal = <T extends HTMLElement = HTMLElement>(
  useToggleModalOption: UseToggleModalOption = {},
): UseToggleModalReturn<T> => {
  const [isModalOpen, toggleModal] = useToggle(useToggleModalOption.initialValue ?? false);

  const modalRef = useRef<T | null>(null);
  const refCallback: RefCallback<T> = useCallback((node) => {
    if (node) {
      modalRef.current = node;
    }
  }, []);

  useEffect(() => {
    const closeModalOnMouseDown = async (e: MouseEvent) => {
      if (useToggleModalOption.openModalOptions?.resistBackgroundClick) return;

      queueMicrotask(() => {
        if (isModalOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
          toggleModal();
        }
      });
    };

    const closeModalOnESC = (e: KeyboardEvent) => {
      if (useToggleModalOption.openModalOptions?.resistESC) return;

      queueMicrotask(() => {
        if (isModalOpen && e.key === 'Escape') {
          toggleModal();
        }
      });
    };

    document.addEventListener('mousedown', closeModalOnMouseDown);
    document.addEventListener('keydown', closeModalOnESC);

    return () => {
      document.removeEventListener('mousedown', closeModalOnMouseDown);
      document.removeEventListener('keydown', closeModalOnESC);
    };
  }, [
    isModalOpen,
    toggleModal,
    useToggleModalOption.openModalOptions?.resistBackgroundClick,
    useToggleModalOption.openModalOptions?.resistESC,
  ]);

  return { isModalOpen, modalRef: refCallback, toggleModal };
};

export { useToggleModal };
