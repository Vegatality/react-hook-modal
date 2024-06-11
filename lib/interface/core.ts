import { ComponentProps, ComponentType, Dispatch, RefCallback, SetStateAction } from 'react';

export type ModalKey = ReadonlyArray<unknown>;
export type HashedModalKey = string;
export type ObjectFrame = Record<PropertyKey, any>;

export interface OpenModalOptions {
  /**
   * #### Is the modal resistant to background clicks
   * @description
   * - If the resistBackgroundClick option is set to an array, the modal will remain open if any modal matching a key in the array is open.
   * - If the resistBackgroundClick option is set to true, the modal will remain open even if user clicks on the background.
   * @default false
   * @example
   * ```tsx
   * openModal({
   *  modalKey: ['test'],
   *  ModalComponent: TestModal,
   *  modalProps: {},
   *  options: { resistBackgroundClick: true },
   * });
   *
   * openModal({
   *  modalKey: ['test', 2],
   *  ModalComponent: TestModal,
   *  modalProps: {},
   *  options: { resistBackgroundClick: [['test']] },
   * });
   *
   * openModal({
   *  modalKey: ['test', 3],
   *  ModalComponent: TestModal,
   *  modalProps: {},
   *  options: { resistBackgroundClick: [['test'], ['test', 2]] },
   * });
   * ```
   */
  resistBackgroundClick?: boolean | Array<ModalKey>;
  /**
   * #### Is the modal resistant to the ESC key
   * @description
   * - If the resistESC option is set to an array, the modal will remain open if any modal matching a key in the array is open.
   * - If the resistESC option is set to true, the modal will remain open even if user presses the ESC key.
   * @default false
   * @example
   * ```tsx
   * openModal({
   *  modalKey: ['test'],
   *  ModalComponent: TestModal,
   *  modalProps: {},
   *  options: { resistESC: true },
   * });
   *
   * openModal({
   *  modalKey: ['test', 2],
   *  ModalComponent: TestModal,
   *  modalProps: {},
   *  options: { resistESC: [['test']] },
   * });
   *
   * openModal({
   *  modalKey: ['test', 3],
   *  ModalComponent: TestModal,
   *  modalProps: {},
   *  options: { resistESC: [['test'], ['test', 2]] },
   * });
   * ```
   */
  resistESC?: boolean | Array<ModalKey>;
  /**
   * #### Is background scrollable
   * @description If any modal in the modalList has the scrollable option set to false, the background will become unscrollable, even if other modals have this option set to true.
   * @default false
   */
  scrollable?: boolean;
}

export interface ModalCallback {
  onClose?: VoidFunction;
  onSubmit?: VoidFunction;
}

export interface RequiredModalProps {
  closeModal: () => Promise<void>;
  submitModal: (e?: React.BaseSyntheticEvent) => Promise<void>;
  modalRef: ReturnType<GenerateModalRef>;
  currentModalKey: ModalKey;
}

export interface OptionalModalProps extends Partial<RequiredModalProps> {}

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
  /**
   * - The internalUniqueKey is used for unique key in the openedModalList.
   * - ~~The reason why the `internalUniqueKey` is used instead of the `modalKey` is that you can open the same modal component multiple times with the same modal key, which would not be appropriate for a list item's unique key.~~
   */
  internalUniqueKey: number;
  hashedModalKey: HashedModalKey;
  modalKey: ModalKey;
  /**
   * The modalRef is managed as a separate property from modalProps.
   */
  modalRef: ReturnType<GenerateModalRef>;
  modalProps: Omit<ComponentProps<MC>, 'modalRef' | 'currentModalKey'>;
  options?: OpenModalOptions;
  ModalComponent: MC;
}

type ExcludedKeysForProcessingOnOpenModalParam = 'hashedModalKey' | 'modalProps' | 'modalRef';
interface OpenModalParam<MC extends ModalComponent = ModalComponent>
  extends Omit<OpenedModalState<MC>, ExcludedKeysForProcessingOnOpenModalParam | 'internalUniqueKey'> {
  modalProps: ModalCallback & Omit<ComponentProps<MC>, keyof RequiredModalProps>;
}
export type SetOpenedModalList = Dispatch<SetStateAction<OpenedModalState<ModalComponent>[]>>;

interface OpenModalImplParam<MC extends ModalComponent = ModalComponent> extends OpenModalParam<MC> {
  modalCountLimit: number | null;
  openedModalList: OpenedModalState<ModalComponent>[];
  setOpenedModalList: SetOpenedModalList;
  modalInfoManageMap: ModalInfoManageMap;
}
export type OpenModalImpl = <MC extends ModalComponent<any>>(openModalParam: OpenModalImplParam<MC>) => void;
// export type OpenModal = <MC extends ModalComponent<{ [key: string]: any }[0]>>(
export type OpenModal = <MC extends ModalComponent<any>>(openModalParam: OpenModalParam<MC>) => void;

interface ModalInfoManageMapState
  extends Omit<OpenedModalState, 'modalRef' | 'modalProps' | 'internalUniqueKey'>,
    ModalCallback {
  modalRef: HTMLElement | null;
}
export type ModalInfoManageMap = Map<HashedModalKey, ModalInfoManageMapState>;

type WatchParam = { modalKey: ModalKey };
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
  hashedModalKey: HashedModalKey;
  options?: OpenModalOptions;
  modalInfoManageMap: ModalInfoManageMap;
}

export type GenerateModalRef = (generateModalRefParam: GenerateModalRefParam) => ModalRef;

interface CloseModalParam {
  /**
   * modalKey should be a string array or a stringified modal key.
   */
  modalKey: ModalKey;
  exact?: boolean;
}
interface CloseModalImplParam extends CloseModalParam {
  modalInfoManageMap: ModalInfoManageMap;
  setOpenedModalList: SetOpenedModalList;
}

type CloseModalImplReturn = Promise<Array<ModalCallback>>;
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

interface DestroyImplParam {
  modalInfoManageMap: ModalInfoManageMap;
  setOpenedModalList: SetOpenedModalList;
}
export type DestroyImpl = (destroyImplParam: DestroyImplParam) => ReturnType<Destroy>;
export type Destroy = () => Promise<void>;

/**
 * changeModalCountLimit will not destroy any currently open modals.
 * It will only affect the limit of the number of modals that can be opened.
 */
export type ChangeModalCountLimit = (newLimits: number) => void;

export interface DefaultMode extends OpenModalOptions {
  resistBackgroundClick?: boolean;
  resistESC?: boolean;
  scrollable?: boolean;
}
export interface GenerateModalAPI {
  modalInfoManageMap: ModalInfoManageMap;
  openedModalList: OpenedModalState[];
  modalCountLimitRef: React.MutableRefObject<number | null>;
  mode?: DefaultMode;
  setOpenedModalList: SetOpenedModalList;
}

export interface GenerateModalAPIReturn {
  watch: Watch;
  destroy: Destroy;
  changeModalCountLimit: ChangeModalCountLimit;
  closeModal: CloseModal;
  openModal: OpenModal;
}

export interface UseModalListOptions {
  modalCountLimit?: number;
  mode?: DefaultMode;
}
export interface UseModalListReturn extends GenerateModalAPIReturn {
  ModalComponentList: () => JSX.Element[];
}
export type UseModalList = (useModalListOptions?: UseModalListOptions) => UseModalListReturn;
