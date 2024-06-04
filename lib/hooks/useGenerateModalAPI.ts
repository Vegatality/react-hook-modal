'use client';

import { useRef, useState } from 'react';
import { GenerateModalAPIReturn, ModalInfoManageMap, OpenedModalState, UseModalListOptions } from '../interface';
import { generateModalAPI } from '../utils/modalCoreUtils';

interface UseGenerateModalAPIParam extends UseModalListOptions {}
interface UseGenerateMoalAPIReturn extends GenerateModalAPIReturn {
  openedModalList: OpenedModalState[];
  modalInfoManageMap: ModalInfoManageMap;
}

export const useGenerateModalAPI = ({ modalCountLimit, mode }: UseGenerateModalAPIParam): UseGenerateMoalAPIReturn => {
  const initialLimitsRef = useRef<number | null>(modalCountLimit ?? null);
  const modalInfoManageMapRef = useRef<ModalInfoManageMap>(new Map());
  const [openedModalList, setOpenedModalList] = useState<OpenedModalState[]>([]);

  const modalAPIs = generateModalAPI({
    modalCountLimitRef: initialLimitsRef,
    modalInfoManageMap: modalInfoManageMapRef.current,
    openedModalList,
    setOpenedModalList,
    mode,
  });

  return {
    ...modalAPIs,
    openedModalList,
    modalInfoManageMap: modalInfoManageMapRef.current,
  };
};
