'use client';

import { useRef, useState } from 'react';
import { GenerateModalAPIReturn, ModalInfoManageMap, OpenedModalState, UseModalListOptions } from '../interface';
import { generateModalAPI } from '../core/modalCore';
import { useForceUpdate } from './useForceUpdate';

interface UseGenerateModalAPIParam extends UseModalListOptions {}
interface UseGenerateMoalAPIReturn extends GenerateModalAPIReturn {
  openedModalList: OpenedModalState[];
  modalInfoManageMap: ModalInfoManageMap;
  forceUpdateState: boolean;
}

export const useGenerateModalAPI = ({ modalCountLimit, mode }: UseGenerateModalAPIParam): UseGenerateMoalAPIReturn => {
  const initialLimitRef = useRef<number | null>(modalCountLimit ?? null);
  const modalInfoManageMapRef = useRef<ModalInfoManageMap>(new Map());
  const [forceUpdateState, forceUpdate] = useForceUpdate();
  const [openedModalList, setOpenedModalList] = useState<OpenedModalState[]>([]);

  return {
    ...generateModalAPI({
      modalInfoManageMap: modalInfoManageMapRef.current,
      openedModalList,
      modalCountLimitRef: initialLimitRef,
      mode,
      forceUpdate,
      setOpenedModalList,
    }),
    openedModalList,
    modalInfoManageMap: modalInfoManageMapRef.current,
    forceUpdateState,
  };
};
