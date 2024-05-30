import { useModalList } from '@/lib';
import TestModal from './TestModal';
import { useEffect } from 'react';

function App() {
  const { ModalComponentList, openModal, watch } = useModalList({
    mode: { resistBackgroundClick: false, resistESC: false, scrollable: true },
  });

  const modal1Watcher = watch({ modalKey: ['test'] });

  useEffect(() => {
    console.log(modal1Watcher);
  }, [modal1Watcher]);

  const openModal1 = () => {
    openModal({
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
    </div>
  );
}

export default App;
