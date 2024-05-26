'use client';

import { useEffect, useRef } from 'react';

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
interface UseToggleModalReturn<T extends HTMLElement> {
  /**
   * is Modal Open
   */
  isModalOpen: boolean;
  /**
   * modal ref
   */
  modalRef: React.MutableRefObject<T | null>;
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
 * @param initialValue - initial value of the modal
 * @default false
 *
 * @param openModalOptions.resistOnBackgroundClick - Is the modal resistant to background clicks
 * @default false
 *
 * @param openModalOptions.resistOnESC - Is the modal resistant to the ESC key
 * @default false
 *
 * @example
 * ```tsx
 * const { isModalOpen, modalRef, toggleModal } = useToggleModal<HTMLDivElement>(false, { resistOnBackgroundClick: true });
 * ```
 */
const useToggleModal = <T extends HTMLElement>(
  initialValue = false,
  openModalOptions?: IOpenModalOptions,
): UseToggleModalReturn<T> => {
  const [isModalOpen, toggleModal] = useToggle(initialValue);

  const modalRef = useRef<T | null>(null);

  useEffect(() => {
    const closeModal = (e: Event) => {
      queueMicrotask(() => {
        if (isModalOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
          toggleModal();
        }
      });
    };

    const closeModalOnMouseDown = async (e: MouseEvent) => {
      if (openModalOptions?.resistBackgroundClick) return;

      closeModal(e);
    };

    const closeModalOnESC = (e: KeyboardEvent) => {
      if (openModalOptions?.resistESC) return;

      if (e.key === 'Escape') {
        toggleModal();
      }
    };

    document.addEventListener('mousedown', closeModalOnMouseDown);
    document.addEventListener('keydown', closeModalOnESC);

    return () => {
      document.removeEventListener('mousedown', closeModalOnMouseDown);
      document.removeEventListener('keydown', closeModalOnESC);
    };
  }, [isModalOpen, toggleModal, openModalOptions]);

  return { isModalOpen, modalRef, toggleModal };
};

export { useToggleModal };
