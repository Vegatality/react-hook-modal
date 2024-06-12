import { ModalComponentProps } from '@/lib';

const TestModal = ({ modalRef, closeModal, name }: ModalComponentProps<{ name: string }>) => {
  return (
    <div ref={modalRef}>
      <h1>Test Modal {name} </h1>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};
export default TestModal;
