import { ComponentProps, ComponentType, RefCallback } from 'react';

/**
 * TODO: It might be better to allow various array types(e.g. tuple type) for the structural modal key, not just a string array.
 */
export type ModalKey = readonly string[];
export type StringifiedModalKey = string;

export type OpenModalOptions = {
  /**
   * #### Is the modal resistant to background clicks
   * @description
   * - If the resistBackgroundClick option is set to a string array, the modal will remain open if any modal with a key matching a string in the array is open.
   * - If the resistBackgroundClick option is set to true, the modal will remain open even if user clicks on the background.
   * @default false
   */
  resistBackgroundClick?: boolean | ModalKey;
  /**
   * #### Is the modal resistant to the ESC key
   * @description
   * - If the resistESC option is set to a string array, the modal will remain open if any modal with a key matching a string in the array is open.
   * - If the resistESC option is set to true, the modal will remain open even if user presses the ESC key.
   * @default false
   */
  resistESC?: boolean | ModalKey;
  /**
   * #### Is background scrollable
   * @description If any modal in the modalList has the scrollable option set to false, the background will become unscrollable, even if other modals have this option set to true.
   * @default false
   */
  scrollable?: boolean;
};

export interface ModalCallback {
  onClose?: VoidFunction;
  onOpen?: VoidFunction;
  onSubmit?: VoidFunction;
}

interface OptionalModalProps {
  closeModal?: () => Promise<void>;
  submitModal?: (e?: React.BaseSyntheticEvent) => Promise<void>;
  modalRef?: ReturnType<SetModalRef>;
  stringifiedCurrentModalKey?: StringifiedModalKey;
}

export interface RequiredModalProps extends Required<OptionalModalProps> {}

/**
 * modalcomponent type
 *
 * @example
 * ```tsx
 * const MyModal: ModalComponent<{ userName: string; }> = ({ closeModal, modalRef, submitModal, userName }) => {
 *  return (
 *     <div ref={modalRef}>
 *        <h1>{userName}</h1>
 *       <button onClick={closeModal}>close</button>
 *       <button onClick={submitModal}>submit</button>
 *     </div>
 *  );
 * };
 * ```
 */
export type ModalComponent<CustomProps = unknown> = ComponentType<CustomProps & RequiredModalProps>;
/**
 * modalcomponent props
 *
 * @example
 * ```tsx
 * const MyModal = ({ closeModal, modalRef, submitModal, userName }: ModalComponentProps<{ userName: string; }>) => {
 *   return (
 *     <div ref={modalRef}>
 *       <h1>{userName}</h1>
 *       <button onClick={closeModal}>close</button>
 *       <button onClick={submitModal}>submit</button>
 *     </div>
 *  );
 * };
 * ```
 */
export type ModalComponentProps<CustomProps = unknown> = ComponentProps<ModalComponent<CustomProps>>;

export interface OpenedModalState<MC extends ModalComponent = ModalComponent> {
  randomUniqueKey: string;
  modalKey: StringifiedModalKey;
  /**
   * The modalRef is managed as a separate property from modalProps.
   */
  modalRef: ReturnType<SetModalRef>;
  modalProps: Omit<ComponentProps<MC>, 'modalRef' | 'stringifiedCurrentModalKey'>;
  options?: OpenModalOptions;
  ModalComponent: MC;
}

type ExcludedKeysForProcessingOnOpenModalParam = 'modalKey' | 'modalProps' | 'modalRef';
type UnnecessaryModalPropsOnOpenModalParam = keyof RequiredModalProps;
interface OpenModalParam<MC extends ModalComponent = ModalComponent>
  extends Omit<OpenedModalState<MC>, ExcludedKeysForProcessingOnOpenModalParam | 'randomUniqueKey'> {
  modalKey: ModalKey;
  modalProps: ModalCallback & Omit<ComponentProps<MC>, UnnecessaryModalPropsOnOpenModalParam>;
}

/**
 * TODO: Find a better alternative to using any
 */
// export type OpenModal = <MC extends ModalComponent<{ [key: string]: any }[0]>>(
export type OpenModal = <MC extends ModalComponent<any>>(openModalParam: OpenModalParam<MC>) => void;

interface ModalInfoManageMapState extends Omit<OpenedModalState, 'modalRef' | 'modalProps'> {
  modalRef: HTMLElement;
}

type WatchParam = { modalKey: ModalKey | StringifiedModalKey };
export type Watch = (watchParam: WatchParam) => ModalInfoManageMapState | undefined;

export type ModalInfoManageMap = Map<StringifiedModalKey, ModalInfoManageMapState>;

/**
 * TODO: The `current` property should have both getter and setter types defined.
 */
export interface ModalRef extends RefCallback<HTMLElement> {
  current: ReturnType<Watch>;
}
type SetModalRefParam = {
  ModalComponent: ModalComponent;
  modalKey: ModalKey;
  options?: OpenModalOptions;
  randomUniqueKey: OpenedModalState['randomUniqueKey'];
};
export type SetModalRef = (setModalRefParam: SetModalRefParam) => ModalRef;

type CloseModalParam = { modalKey: ModalKey | StringifiedModalKey };
export type CloseModal = (closeModalParam: CloseModalParam) => Promise<void>;

export type Destroy = () => Promise<void>;
export type ChangeModalCountLimit = (newLimits: number) => void;

export interface UseModalListParam {
  modalCountLimit?: number;
}
export interface UseModalListReturn {
  watch: Watch;
  destroy: Destroy;
  changeModalCountLimit: ChangeModalCountLimit;
  openModal: OpenModal;
  closeModal: CloseModal;
  ModalComponentList: () => JSX.Element[];
}
export type UseModalList = (useModalListParam?: UseModalListParam) => UseModalListReturn;
