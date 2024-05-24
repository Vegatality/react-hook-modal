import { useGlobalModalListState } from './useGlobalModalListDispatch';

export const GlobalModalList = () => {
  const globalModalListState = useGlobalModalListState();

  return globalModalListState.length
    ? globalModalListState.map(({ ModalComponent, modalKey, modalProps, modalRef, randomUniqueKey }) => (
        <ModalComponent
          key={randomUniqueKey}
          {...modalProps}
          stringifiedCurrentModalKey={modalKey}
          modalRef={modalRef}
        />
      ))
    : null;
};
