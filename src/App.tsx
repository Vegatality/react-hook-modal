import { Reducer, useEffect, useReducer } from 'react';
import { useGlobalModalList, useModalList, useToggleModal } from '@/lib';
import NoPropsModal from './NoPropsModal';
import TestModal from './TestModal';

function App() {
  const [, forceUpdate] = useReducer<Reducer<boolean, void>>((b) => !b, false);

  console.log('rerendered');

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
      modalProps: { name: '1' },
      options: { resistBackgroundClick: true },
    });
  };

  const openModal2 = () => {
    openModal({
      modalKey: ['test', 2],
      ModalComponent: TestModal,
      modalProps: { name: '1' },
      options: { resistBackgroundClick: [['test']] },
    });
  };

  const openModal3 = () => {
    openModal({
      modalKey: ['test', 2, 'noprops'],
      ModalComponent: NoPropsModal,
      options: { resistBackgroundClick: [['test'], ['test', 2]] },
    });
  };

  const openGlobalModal1 = () => {
    openGlobalModal({
      modalKey: ['test'],
      ModalComponent: TestModal,
      modalProps: { name: '1' },
      options: { resistBackgroundClick: false },
    });
  };

  const killTestModals = () => {
    closeModal({ modalKey: ['test'] });
  };

  const killTestModal2 = () => {
    closeModal({ modalKey: ['test', 2], exact: true });
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
      <button type='button' onClick={forceUpdate}>
        rerender
      </button>
      <button type='button' onClick={killTestModals}>
        kill TestModals
      </button>
      <button type='button' onClick={killTestModal2}>
        kill TestModal2
      </button>
      <button type='button' onClick={openModal1}>
        Open Modal 1
      </button>
      <button type='button' onClick={openModal2}>
        Open Modal 2
      </button>
      <button type='button' onClick={openModal3}>
        Open Modal 3
      </button>
      <button type='button' onClick={openGlobalModal1}>
        Open Global Modal 1
      </button>
      <button type='button' onClick={toggleModal}>
        Toggle Modal
      </button>
    </div>
  );
}

export default App;
