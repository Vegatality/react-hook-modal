import { ModalComponent } from '@/lib';
import { PropsWithChildren } from 'react';

const NoPropsModal: ModalComponent<PropsWithChildren> = ({ modalRef, closeModal, children }) => {
  return (
    <div ref={modalRef}>
      <h1>No Props Modal</h1>
      <button onClick={closeModal}>Close</button>
      {children}
    </div>
  );
};
export default NoPropsModal;
