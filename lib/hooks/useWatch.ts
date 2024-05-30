import { useEffect, useState } from 'react';
import { ModalInfoManageMap, OpenedModalState, Watch } from '../interface';
import { watchModalImpl } from '../utils/modalCoreUtils';

interface UseWatchParam {
  modalInfoManageMapRefCurrent: ModalInfoManageMap;
  openedModalList: OpenedModalState[];
}

export const useWatch = ({ modalInfoManageMapRefCurrent, openedModalList }: UseWatchParam): Watch => {
  const [modalInfoManageMapState, setModalInfoManageMapState] =
    useState<ModalInfoManageMap>(modalInfoManageMapRefCurrent);

  useEffect(() => {
    setModalInfoManageMapState(new Map(modalInfoManageMapRefCurrent));
  }, [openedModalList]);

  const watch: Watch = ({ modalKey }) => watchModalImpl({ modalKey, modalInfoManageMap: modalInfoManageMapState });

  return watch;
};
