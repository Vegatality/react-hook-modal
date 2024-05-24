import { useEffect, useRef } from 'react';

import { OpenModalOptions } from '../interface';
import { useToggle } from './useToggle';

interface UseToggleModalReturn<T extends HTMLElement> {
  /**
   * 모달이 열려있는지 여부
   */
  isModalOpen: boolean;
  /**
   * 모달의 ref
   */
  modalRef: React.MutableRefObject<T | null>;
  /**
   * 모달을 열거나 닫는 함수
   */
  toggleModal: () => void;
}

/**
 * useModal Core Hook
 *
 * 굳이 모달이 아니어도 사용할 수 있음.
 *
 * @example
 * ```tsx
 * const { isModalOpen, modalRef, toggleModal } = useToggleModal<HTMLDivElement>(false, { persist: true });
 * ```
 */
const useToggleModal = <T extends HTMLElement>(
  initialValue = false,
  openModalOptions?: OpenModalOptions,
): UseToggleModalReturn<T> => {
  const [isModalOpen, toggleModal] = useToggle(initialValue);

  const modalRef = useRef<T | null>(null);

  useEffect(() => {
    const closeModal = async (e: MouseEvent) => {
      if (openModalOptions?.persist) return;

      queueMicrotask(() => {
        if (isModalOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
          toggleModal();
        }
      });
    };

    document.addEventListener('mousedown', closeModal);

    return () => {
      document.removeEventListener('mousedown', closeModal);
    };
  }, [isModalOpen, toggleModal, openModalOptions]);

  return { isModalOpen, modalRef, toggleModal };
};

export { useToggleModal };
