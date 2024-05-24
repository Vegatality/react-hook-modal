import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useModalList, {
  ModalComponent,
  ModalComponentProps,
  ModalProvider,
  useGlobalModalList,
  useModalContext,
} from './use-modal';

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
    containerRef.current = document.querySelector<HTMLDivElement>('#modal');

    return () => setIsMounted(false);
  }, []);

  return isMounted && containerRef.current ? createPortal(children, containerRef.current) : null;
};

const TestModal = ({
  name,
  modalRef,
  closeModal,
  stringifiedCurrentModalKey,
}: ModalComponentProps<{ name: string }>) => {
  useEffect(() => {
    console.log('stringifiedCurrentModalKey', stringifiedCurrentModalKey);

    return () => console.log('cleanup', stringifiedCurrentModalKey);
  }, [stringifiedCurrentModalKey]);
  return (
    <button type='button' ref={modalRef} onClick={closeModal}>
      close-{name}-modal
    </button>
  );
};

const Test2Modal: ModalComponent<{ name: string }> = ({ name, modalRef, closeModal }) => {
  return (
    <button type='button' ref={modalRef} onClick={closeModal}>
      {name}-modal
    </button>
  );
};

function Test3Modal({ name, modalRef, closeModal }: ModalComponentProps<{ name: string }>) {
  return (
    <button type='button' ref={modalRef} onClick={closeModal}>
      {name}-modal
    </button>
  );
}

function Test4Modal({ name, modalRef, closeModal }: ModalComponentProps<{ name: string }>) {
  return (
    <button type='button' ref={modalRef} onClick={closeModal}>
      {name}-modal
    </button>
  );
}

function Test5Modal({ modalRef, closeModal }: ModalComponentProps) {
  return (
    <button type='button' ref={modalRef} onClick={closeModal}>
      modal
    </button>
  );
}

const Test6Modal: ModalComponent = ({ modalRef, closeModal }) => {
  return (
    <button type='button' ref={modalRef} onClick={closeModal}>
      -modal
    </button>
  );
};

function App() {
  const methods = useModalList();
  const { openGlobalModal } = useGlobalModalList();
  const { openModal, ModalComponentList, destroy } = methods;
  console.log('rendering');

  const handleOpenModal = () => {
    openModal({
      modalKey: ['test'],
      ModalComponent: TestModal,
      modalProps: { name: 'test' },
    });
  };

  const handleOpenModal2 = () => {
    openModal({
      modalKey: ['test2'],
      ModalComponent: Test2Modal,
      modalProps: { name: 'test2' },
      options: {
        scrollable: false,
        persist: true,
      },
    });
  };

  const handleOpenModal3 = () => {
    openModal({
      modalKey: ['test3'],
      ModalComponent: Test3Modal,
      modalProps: { name: 'test3' },
    });
  };

  const handleOpenGlobalModal = () => {
    openGlobalModal({
      modalKey: ['global'],
      ModalComponent: Test4Modal,
      modalProps: { name: 'global' },
    });
  };

  const handleOpenModal5 = () => {
    openModal({
      modalKey: ['test5'],
      ModalComponent: Test5Modal,
      modalProps: {},
    });
  };

  const handleOpenModal6 = () => {
    openModal({
      modalKey: ['test6'],
      ModalComponent: Test6Modal,
      modalProps: {},
    });
  };

  useEffect(
    () => () => {
      destroy();
    },
    [],
  );

  return (
    <div>
      <Portal>
        <ModalComponentList />
      </Portal>
      <button type='button' onClick={handleOpenModal}>
        open modal
      </button>
      <button type='button' onClick={handleOpenModal2}>
        open modal2
      </button>
      <button type='button' onClick={handleOpenModal3}>
        open modal3
      </button>
      <button type='button' onClick={handleOpenGlobalModal}>
        open global modal
      </button>
      <button type='button' onClick={handleOpenModal5}>
        open modal5
      </button>
      <button type='button' onClick={handleOpenModal6}>
        open modal6
      </button>
      <ModalProvider {...methods}>
        <Child />
      </ModalProvider>
    </div>
  );
}

function Child() {
  const { closeModal, destroy } = useModalContext();

  return (
    <div>
      <h1>Child</h1>
      <button type='button' onClick={() => closeModal({ modalKey: ['test'] })}>
        close modal
      </button>
      <button type='button' onClick={destroy}>
        close all modals
      </button>
    </div>
  );
}

export default App;
