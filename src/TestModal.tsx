import { ModalComponentProps } from '../';

const TestModal = ({ modalRef, closeModal }: ModalComponentProps) => {
  return (
    <div ref={modalRef}>
      <h1>Test Modal</h1>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};
export default TestModal;
