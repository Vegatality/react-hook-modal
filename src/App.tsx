import { useGlobalModalList, useModalList } from '@/lib';
import TestModal from './TestModal';
import { useEffect } from 'react';

function App() {
  const { ModalComponentList, openModal, watch } = useModalList({
    mode: { resistBackgroundClick: false, resistESC: false, scrollable: true },
  });

  const { openGlobalModal, watchGlobalModal } = useGlobalModalList({
    mode: { resistBackgroundClick: false, resistESC: false, scrollable: true },
  });

  const modal1Watcher = watch({ modalKey: ['test'] });
  const modal1Watcher2 = watch({ modalKey: ['test2'] });
  const globalModalWatcher = watchGlobalModal({ modalKey: ['test'] });

  useEffect(() => {
    console.log(modal1Watcher);
  }, [modal1Watcher]);

  useEffect(() => {
    console.log(modal1Watcher2);
  }, [modal1Watcher2]);

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
      modalKey: ['test2'],
      ModalComponent: TestModal,
      modalProps: {},
      options: { resistBackgroundClick: true },
    });
  };

  const openGlobalModal1 = () => {
    openGlobalModal({
      modalKey: ['test'],
      ModalComponent: TestModal,
      modalProps: {},
      options: { resistBackgroundClick: true },
    });
  };

  return (
    <div>
      <ModalComponentList />
      <button onClick={openModal1}>Open Modal 1</button>
      <button onClick={openModal2}>Open Modal 1 duplicate</button>
      <button onClick={openGlobalModal1}>Open Global Modal 1</button>
    </div>
  );
}

export default App;
