import { ModalComponentProps } from '@/lib';
import './modal.css';

const TestModal = ({
  modalRef,
  closeModal,
  makeUnScrollable,
  name,
}: ModalComponentProps<{ name: string; makeUnScrollable?: VoidFunction }>) => {
  return (
    <div className='dim'>
      <div ref={modalRef} className='modal'>
        <h1>Test Modal {name}</h1>
        <button onClick={closeModal}>Close</button>
        {makeUnScrollable && (
          <button type='button' onClick={makeUnScrollable}>
            make unscrollable
          </button>
        )}
      </div>
    </div>
  );
};
export default TestModal;
