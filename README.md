# A simple modal hook for React

This is a simple modal hook for React.<br />
It is a custom hook that allows you to create a modal with a simple API.

<br />

## TOC

- [Installation](#installation)
- [Usage](#usage)
  - [Local State Layer](#1-local-state-layer)
    - [with Context API](#1-1-with-context-api)
  - [Global State Layer](#2-global-state-layer)
  - [Can open Multiple Modals](#3-can-open-multiple-modals)
  - [Close Modal API](#4-close-modal-api)
    - [Default Closing Modal Order with Options](#4-1-default-closing-modal-order-with-options)
    - [Handling Modals with Options](#4-2-handling-modals-with-options)
    - [Resist other modals](#4-3-resist-other-modals)
  - [Pass `modalRef` Prop](#5-pass-modalref-prop)
  - [`useToggleModal` Hook](#6-usetogglemodal-hook)
- [Types](#types)

<br />

## Installation

```bash
# npm
npm i @vegatality/react-hook-modal

# yarn
yarn add @vegatality/react-hook-modal

# pnpm
pnpm add @vegatality/react-hook-modal
```

<br />

## Usage

### 1. Local State Layer

<details>
<summary>View</summary>

```tsx
import { useModalList, type ModalComponent } from '@vegatality/react-hook-modal';

// const SomeModal = ({ closeModal, modalRef }: ModalComponentProps<{ name: string }>) => {
const SomeModal: ModalComponent<{ name: string }> = ({ closeModal, modalRef, name }) => {
  return (
    <div ref={modalRef}>
      <h1>Some Modal</h1>
      <p>{name}</p>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

const App = () => {
  const { ModalComponentList, openModal, closeModal, watch, destroy, ... } = useModalList();

  return (
    <div>
      <ModalComponentList />
      <button onClick={() => openModal({ modalKey: ['some'], ModalComponent: SomeModal, props: { name: 'some' }, options: { resistBackgroundClick: true } })}>
        Open Modal 1
      </button>
    </div>
  );
};
```

</details>

#### 1-1. with Context API

<details>
<summary>View</summary>

```tsx
import { useModalList, useModalContext, ModalProvider, type ModalComponent } from '@vegatality/react-hook-modal';

const SomeModal: ModalComponent<{ name: string }> = ({ closeModal, modalRef, name }) => {
  return (
    <div ref={modalRef}>
      <h1>Some Modal</h1>
      <p>{name}</p>
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

</details>

<br />

### 2. Global State Layer

<details>
<summary>View</summary>

```tsx
import {
  useGlobalModalList,
  GlobalModalList,
  GlobalModalListProvider,
  type ModalComponentProps,
} from '@vegatality/react-hook-modal';

const SomeModal = ({ closeModal, modalRef, name }: ModalComponentProps<{ name: string }>) => {
  return (
    <div ref={modalRef}>
      <h1>Some Modal</h1>
      <p>{name}</p>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};
const App = () => {
  const { openGlobalModal } = useGlobalModalList(); // useGlobalModalList hook uses useContext hook under the hood

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

</details>

<br />

### 3. Can open Multiple Modals

You can open multiple modals with `openModal` api from `useModalList` hook.

<details>
<summary>View</summary>

```tsx
import { useModalList, type ModalComponent } from '@vegatality/react-hook-modal';

const SomeModal: ModalComponent<{ name: string }> = ({ closeModal, modalRef, name }) => {
  return (
    <div ref={modalRef}>
      <h1>Some Modal</h1>
      <p>{name}</p>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

const SomeModal2: ModalComponent<{ name: string }> = ({ closeModal, modalRef, name }) => {
  return (
    <div ref={modalRef}>
      <h1>Some Modal2</h1>
      <p>{name}</p>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

const App = () => {
  const { ModalComponentList, openModal, closeModal, watch, destroy, ... } = useModalList();

  return (
    <div>
      <ModalComponentList />
      <button onClick={() => openModal({ modalKey: ['some'], ModalComponent: SomeModal, props: { name: 'some' }, options: { resistBackgroundClick: true } })}>
        Open Modal 1
      </button>
      <button onClick={() => openModal({ modalKey: ['some2'], ModalComponent: SomeModal2, props: { name: 'some2' }, options: { resistBackgroundClick: false, scrollable: false } })}>
        Open Modal 2
      </button>
    </div>
  );
};
```

</details>

<br />

### 4. Close Modal API

You can close the modal using the modal key that was passed when it was opened.

<details>
<summary>View</summary

```ts
const { ModalComponentList, openModal, closeModal, watch, destroy, ... } = useModalList();

closeModal({ modalKey: ['some'] });
```

</details>

If you want to close all modals, you can use the `destroy` method.

<details>
<summary>View</summary>

```ts
useEffect(
  () => () => {
    destroy();
  },
  [],
);
```

</details>

<br />

#### 4-1. Default Closing Modal Order with Options

If multiple modals are open, they will close in the order they were opened, starting with the most recently opened modal.

<br />

#### 4-2. Handling Modals with Options

If the option value of the most recently opened modal is `true` or if there is a specified `modalKey` to resist, it will find and close the most recent modal with the specified option value set to false that was opened before it.<br />
For example, if the `resistBackgroundClick` option value of the most recently opened modal is `true`, it will find and close the earlier opened modal with the `resistBackgroundClick` value set to `false` when the background is clicked.

<br />

#### 4-3. Resist other modals

You can prevent the modal from closing if the specified modal is open.<br />
Just specify the modalKey of the modal you want to resist in the `options` object when opening the modal.

<details>
<summary>View</summary>

```tsx
import { useModalList, type ModalComponent } from '@vegatality/react-hook-modal';

const SomeModal: ModalComponent<{ name: string }> = ({ closeModal, modalRef, name }) => {
  return (
    <div ref={modalRef}>
      <h1>Some Modal</h1>
      <p>{name}</p>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

const SomeModal2: ModalComponent<{ name: string }> = ({ closeModal, modalRef, name }) => {
  return (
    <div ref={modalRef}>
      <h1>Some Modal2</h1>
      <p>{name}</p>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

const App = () => {
  const { ModalComponentList, openModal, closeModal, watch, destroy, ... } = useModalList();

  return (
    <div>
      <ModalComponentList />
      <button onClick={() => openModal({ modalKey: ['some'], ModalComponent: SomeModal, props: { name: 'some' }, options: { resistBackgroundClick: true } })}>
        Open Modal 1
      </button>
      <button onClick={() => openModal({ modalKey: ['some2'], ModalComponent: SomeModal2, props: { name: 'some2' }, options: { resistBackgroundClick: ['some'] } })}> /* 👈 this will resist background click until 'some' modal is closed */
        Open Modal 2
      </button>
    </div>
  );
};
```

</details>

<br />

### 5. Pass `modalRef` Prop

`modalRef` is a reference to the modal element.<br />
You have to pass the `modalRef` to the element ref.<br />
It determine the valid area of a modal.

<details>
<summary>View</summary>

```tsx
import { ModalComponent } from '@vegatality/react-hook-modal';

const SomeModal: ModalComponent<{ name: string }> = ({ closeModal, modalRef, name }) => {
  return (
    <div className='modal_boundary' ref={modalRef}>
      <h1>Some Modal</h1>
      <p>{name}</p>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};
```

</details>

If you don't pass the `modalRef`, the modal will not close even if you set `resistBackgroundClick` to false (default).<br />
This is because, without `modalRef`, we can't determine the valid boundary of the modal.<br />
However, the modal will close properly when the `ESC` key is pressed, regardless of whether the `modalRef` is passed.

<br />

### 6. `useToggleModal` Hook

You can use the `useToggleModal` hook to toggle the modal instead of using `useModalList` hook.<br />
It is a simple hook that returns the `isModalOpen`, `modalRef`, and `toggleModal` function that only controls a single modal.

<details>
<summary>View</summary>

```tsx
import { useToggleModal } from '@vegatality/react-hook-modal';

function App() {
  const { isModalOpen, modalRef, toggleModal } = useToggleModal<HTMLDivElement>(false, {
    resistOnBackgroundClick: true,
  });
  return (
    <div>
      <button onClick={toggleModal}>Toggle Modal</button>
      {isModalOpen && (
        <div ref={modalRef}>
          <h1>Modal</h1>
          <button onClick={toggleModal}>Close Modal</button>
        </div>
      )}
    </div>
  );
}
```

</details>

<br />

## Types

Providing types for the modal component.<br />
You can use them as shown below.

<details>
<summary>View</summary>

```tsx
import type { ModalComponent, ModalComponentProps } from '@vegatality/react-hook-modal';

export const TestModal = ({ name, closeModal, modalRef }: ModalComponentProps<{ name: string }>) => {
  return (
    <div ref={modalRef}>
      <h1>Test Modal</h1>
      <p>{name}</p>
      <button type='button' onClick={closeModal}>
        Close Modal
      </button>
    </div>
  );
};

export const TestModal2: ModalComponent<{ name: string }> = ({ name, closeModal, modalRef }) => {
  return (
    <div ref={modalRef}>
      <h1>Test Modal</h1>
      <p>{name}</p>
      <button type='button' onClick={closeModal}>
        Close Modal
      </button>
    </div>
  );
};
```

</details>

<br />

However, you don't have to use the provided modal component types(e.g. ModalComponent, ModalComponentProps).<br />
You can use your own defined types.

<details>
<summary>View</summary>

```tsx
import { ModalRef } from '@vegatality/react-hook-modal';

interface SomeModalProps {
  name: string;
  modalRef: ModalRef;
}

const SomeModal = ({ name, modalRef }: SomeModalProps) => {
  return (
    <div ref={modalRef}>
      <h1>Test Modal</h1>
      <p>{name}</p>
    </div>
  );
};

const App = () => {
  const { ModalComponentList, openModal, closeModal, watch, destroy, ... } = useModalList();

  return (
    <div>
      <ModalComponentList />
      <button onClick={() => openModal({ modalKey: ['some'], ModalComponent: SomeModal, props: { name: 'some' }, options: { resistBackgroundClick: true } })}>
        Open Modal 1
      </button>
      <button onClick={() => openModal({ modalKey: ['some2'], ModalComponent: SomeModal2, props: { name: 'some2' }, options: { resistBackgroundClick: false, scrollable: false } })}>
        Open Modal 2
      </button>
      <button onClick={() => closeModal({ modalKey: ['some2'] })}>Close Modal 2</button>
    </div>
  );
};

```

</details>
