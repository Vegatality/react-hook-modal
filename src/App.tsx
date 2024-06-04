import { useGlobalModalList, useModalList, useToggleModal } from '@/lib';
import TestModal from './TestModal';
import { useEffect } from 'react';

function App() {
  const { ModalComponentList, openModal, watch, closeModal } = useModalList({
    mode: { resistBackgroundClick: false, resistESC: false, scrollable: true },
  });

  const { openGlobalModal, watchGlobalModal } = useGlobalModalList({
    mode: { resistBackgroundClick: false, resistESC: false, scrollable: true },
  });

  const { isModalOpen, modalRef, toggleModal } = useToggleModal({
    initialValue: false,
    openModalOptions: { resistBackgroundClick: true },
  });

  const modalWatcher = watch({ modalKey: ['test'] });
  const modalWatcher2 = watch({ modalKey: ['test', 2] });
  const globalModalWatcher = watchGlobalModal({ modalKey: ['test'] });

  useEffect(() => {
    console.log(modalWatcher);
  }, [modalWatcher]);

  useEffect(() => {
    console.log(modalWatcher2);
  }, [modalWatcher2]);

  useEffect(() => {
    console.log(globalModalWatcher);
  }, [globalModalWatcher]);

  const openModal1 = () => {
    openModal({
      modalKey: ['test'],
      ModalComponent: TestModal,
      modalProps: {},
      options: { resistBackgroundClick: true },
    });
  };

  const openModal2 = () => {
    openModal({
      modalKey: ['test', 2],
      ModalComponent: TestModal,
      modalProps: {},
      options: { resistBackgroundClick: [['test']] },
    });
  };

  const openGlobalModal1 = () => {
    openGlobalModal({
      modalKey: ['test'],
      ModalComponent: TestModal,
      modalProps: {},
      options: { resistBackgroundClick: false },
    });
  };

  const killTestModals = () => {
    closeModal({ modalKey: ['test'], exact: true });
  };

  return (
    <div>
      <ModalComponentList />
      {isModalOpen && (
        <div ref={modalRef}>
          <h1>Modal</h1>
          <button onClick={toggleModal}>Close Modal</button>
        </div>
      )}
      <button onClick={killTestModals}>kill TestModals</button>
      <button onClick={openModal1}>Open Modal 1</button>
      <button onClick={openModal2}>Open Modal 1 duplicate</button>
      <button onClick={openGlobalModal1}>Open Global Modal 1</button>
      <button onClick={toggleModal}>Toggle Modal</button>
    </div>
  );
}

export default App;
