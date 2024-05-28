import { ComponentProps, ComponentType, Dispatch, RefCallback, SetStateAction } from 'react';

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
  onSubmit?: VoidFunction;
}

interface OptionalModalProps {
  closeModal?: () => Promise<void>;
  submitModal?: (e?: React.BaseSyntheticEvent) => Promise<void>;
  modalRef?: ReturnType<GenerateModalRef>;
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
  internalUniqueKey: number;
  modalKey: StringifiedModalKey;
  /**
   * The modalRef is managed as a separate property from modalProps.
   */
  modalRef: ReturnType<GenerateModalRef>;
  modalProps: Omit<ComponentProps<MC>, 'modalRef' | 'stringifiedCurrentModalKey'>;
  options?: OpenModalOptions;
  ModalComponent: MC;
}

type ExcludedKeysForProcessingOnOpenModalParam = 'modalKey' | 'modalProps' | 'modalRef';
type UnnecessaryModalPropsOnOpenModalParam = keyof RequiredModalProps;
interface OpenModalParam<MC extends ModalComponent = ModalComponent>
  extends Omit<OpenedModalState<MC>, ExcludedKeysForProcessingOnOpenModalParam | 'internalUniqueKey'> {
  modalKey: ModalKey;
  modalProps: ModalCallback & Omit<ComponentProps<MC>, UnnecessaryModalPropsOnOpenModalParam>;
}
type SetOpenedModalList = Dispatch<SetStateAction<OpenedModalState<ModalComponent>[]>>;

interface OpenModalImplParam<MC extends ModalComponent = ModalComponent> extends OpenModalParam<MC> {
  modalCountLimit: number | null;
  openedModalList: OpenedModalState<ModalComponent>[];
  setOpenedModalList: SetOpenedModalList;
  modalInfoManageMap: ModalInfoManageMap;
}
export type OpenModalImpl = <MC extends ModalComponent<any>>(openModalParam: OpenModalImplParam<MC>) => void;
/**
 * TODO: Find a better alternative to using any
 */
// export type OpenModal = <MC extends ModalComponent<{ [key: string]: any }[0]>>(
export type OpenModal = <MC extends ModalComponent<any>>(openModalParam: OpenModalParam<MC>) => void;

interface ModalInfoManageMapState
  extends Omit<OpenedModalState, 'modalRef' | 'modalProps' | 'internalUniqueKey'>,
    ModalCallback {
  modalRef: HTMLElement | null;
}
export type ModalInfoManageMap = Map<StringifiedModalKey, ModalInfoManageMapState>;

type WatchParam = { modalKey: ModalKey | StringifiedModalKey };
interface WatchImplParam extends WatchParam {
  modalInfoManageMap: ModalInfoManageMap;
}
export type WatchImpl = (watchImplParam: WatchImplParam) => ReturnType<Watch>;
export type Watch = (watchParam: WatchParam) => ModalInfoManageMapState | undefined;

/**
 * TODO: The `current` property should have both getter and setter types defined.
 */
export interface ModalRef extends RefCallback<HTMLElement> {
  current: ReturnType<Watch>;
}
interface GenerateModalRefParam extends ModalCallback {
  ModalComponent: ModalComponent;
  modalKey: ModalKey;
  options?: OpenModalOptions;
  modalInfoManageMap: ModalInfoManageMap;
}

export type GenerateModalRef = (generateModalRefParam: GenerateModalRefParam) => ModalRef;

type CloseModalParam = {
  /**
   * modalKey should be a string array or a stringified modal key.
   */
  modalKey: ModalKey | StringifiedModalKey;
};
interface CloseModalImplParam extends CloseModalParam {
  modalInfoManageMap: ModalInfoManageMap;
  setOpenedModalList: SetOpenedModalList;
}

interface CloseModalImplReturn extends Promise<ModalCallback> {}
export type CloseModalImpl = (closeModalImplParam: CloseModalImplParam) => CloseModalImplReturn;
export type CloseModal = (closeModalParam: CloseModalParam) => Promise<void>;

interface HandleCloseModalParam {
  modalKey: ModalKey;
  modalInfoManageMap: ModalInfoManageMap;
  setOpenedModalList: SetOpenedModalList;
}
export type HandleCloseModal = (handleCloseModalParam: HandleCloseModalParam) => () => Promise<void>;

interface HandleSubmitModalParam extends HandleCloseModalParam {}
export type HandleSubmitModal = (
  handleSubmitModalParam: HandleSubmitModalParam,
) => (e?: React.BaseSyntheticEvent) => Promise<void>;

type DestroyImplParam = {
  modalInfoManageMap: ModalInfoManageMap;
  setOpenedModalList: SetOpenedModalList;
};
export type DestroyImpl = (destroyImplParam: DestroyImplParam) => ReturnType<Destroy>;
export type Destroy = () => Promise<void>;

/**
 * changeModalCountLimit will not destroy any currently open modals.
 * It will only affect the limit of the number of modals that can be opened.
 */
export type ChangeModalCountLimit = (newLimits: number) => void;

export interface DefaultMode extends OpenModalOptions {
  resistBackgroundClick: boolean;
  resistESC: boolean;
  scrollable: boolean;
}
export interface UseModalListOptions {
  modalCountLimit?: number;
  mode?: DefaultMode;
}
export interface UseModalListReturn {
  watch: Watch;
  destroy: Destroy;
  changeModalCountLimit: ChangeModalCountLimit;
  openModal: OpenModal;
  closeModal: CloseModal;
  ModalComponentList: () => JSX.Element[];
}
export type UseModalList = (useModalListParam?: UseModalListOptions) => UseModalListReturn;
