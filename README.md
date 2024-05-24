# A simple modal hook for React

This is a simple modal hook for React. It is a custom hook that allows you to create a modal with a simple API.

## Installation

## Usage

### 1. Local State Layer

```tsx
import { useModalList, type ModalComponent } from 'react-hook-modal';

// const SomeModal = ({ closeModal, modalRef }: ModalComponentProps<{ name: string }>) => {
const SomeModal: ModalComponent<{ name: string }> = ({ closeModal, modalRef }) => {
  return (
    <div ref={modalRef}>
      <h1>Some Modal</h1>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

const App = () => {
  const { ModalComponentList, openModal, closeModal, watch, destroy, ... } = useModalList();

  return (
    <div>
      <ModalComponentList />
      <button onClick={() => openModal({ modalKey: ['some'], ModalComponent: SomeModal, props: { name: 'some' } })}>
        Open Modal 1
      </button>
    </div>
  );
};
```

#### 1-1. with Context API

```tsx
import { useModalList, useModalContext, ModalProvider, type ModalComponent } from 'react-hook-modal';

const SomeModal: ModalComponent<{ name: string }> = ({ closeModal, modalRef }) => {
  return (
    <div ref={modalRef}>
      <h1>Some Modal</h1>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

const ChildComponent = () => {
  const { openModal } = useModalContext();

  return (
    <button onClick={() => openModal({ modalKey: ['some'], ModalComponent: SomeModal, props: { name: 'some' } })}>
      Open Modal 1
    </button>
  );
};

const App = () => {
  const methods = useModalList();
  const { ModalComponentList, openModal } = methods;

  return (
    <div>
      <ModalComponentList />
      <ModalProvider {...methods}>
        <ChildComponent />
      </ModalProvider>
    </div>
  );
};
```

### 2. Global State Layer

```tsx
import {
  useGlobalModalList,
  GlobalModalList,
  GlobalModalListProvider,
  type ModalComponentProps,
} from 'react-hook-modal';

const SomeModal = ({ closeModal, modalRef }: ModalComponentProps<{ name: string }>) => {
  return (
    <div ref={modalRef}>
      <h1>Some Modal</h1>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};
const App = () => {
  const { openGlobalModal } = useGlobalModalList();

  return (
    <button onClick={() => openGlobalModal({ modalKey: ['some'], ModalComponent: SomeModal, props: { name: 'some' } })}>
      Open Modal 1
    </button>
  );
};

const Main = () => {
  return (
    <GlobalModalListProvider>
      <App />
      <GlobalModalList />
    </GlobalModalListProvider>
  );
};
```
