'use client';

import { DefaultMode, IGlobalModalListDispatchContext, ModalComponent, OpenModal } from '../interface';
import { useGlobalModalListDispatch } from './useGlobalModalListDispatch';

interface UseGlobalModalListOptions {
  /**
   * Default mode for the modal.
   * - This will override the mode in the options of the GlobalModalListProvider props.
   */
  mode?: DefaultMode;
}

export const useGlobalModalList = (
  useGlobalModalListOptions: UseGlobalModalListOptions = {},
): IGlobalModalListDispatchContext => {
  const { openGlobalModal, ...restAPI } = useGlobalModalListDispatch();

  const openGlobalModalWithDefaultMode: OpenModal = ({ options, ...restOpenGlobalModalParam }) => {
    openGlobalModal<ModalComponent>({
      options: { ...useGlobalModalListOptions.mode, ...options },
      ...restOpenGlobalModalParam,
    });
  };

  return {
    openGlobalModal: openGlobalModalWithDefaultMode,
    ...restAPI,
  };
};
