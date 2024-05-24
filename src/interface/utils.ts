export type NoInfer<T> = [T][T extends any ? 0 : never];

export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type RemappedOmit<T extends object, U extends PropertyKey> = {
  [K in keyof T as K extends U ? never : K]: T[K];
};

export type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

export type SetPickedPropToRequired<T extends object, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Checks whether the type is any
 * See {@link https://stackoverflow.com/a/49928360/3406963}
 * @typeParam T - type which may be any
 * ```
 * IsAny<any> = true
 * IsAny<string> = false
 * ```
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

// type PathInto<T extends Record<PropertyKey, any>> = keyof {
export type PathInto<T extends Record<string, any>> = keyof {
  [K in keyof T as T[K] extends string
    ? K
    : T[K] extends Record<string, any>
    ? `${K & string}.${PathInto<T[K]> & string}`
    : never]: any;
};
