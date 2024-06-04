import { ModalKey, ObjectFrame } from '../interface';

export function isPlainArray(value: unknown) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}

function hasObjectPrototype(o: any): boolean {
  return Object.prototype.toString.call(o) === '[object Object]';
}

// Copied from: https://github.com/jonschlinkert/is-plain-object
// export function isPlainObject(o: any): o is object {
export function isPlainObject(o: any): o is ObjectFrame {
  if (!hasObjectPrototype(o)) {
    return false;
  }

  // If has no constructor
  const ctor = o.constructor;
  if (ctor === undefined) {
    return true;
  }

  // If has modified prototype
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // If constructor does not have an Object-specific method
  // if (!prot.hasOwnProperty('isPrototypeOf')) {
  if (!Object.prototype.hasOwnProperty.call(prot, 'isPrototypeOf')) {
    return false;
  }

  // Handles Objects created by Object.create(<arbitrary prototype>)
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

/**
 * Default query & mutation keys hash function.
 * Hashes the value into a stable hash.
 *
 * exact: true일 때 key 비교 용도로 사용
 */
export function hashKey(queryKey: ModalKey): string {
  return JSON.stringify(queryKey, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort()
          .reduce((result, key) => {
            result[key] = val[key];
            return result;
          }, {} as ObjectFrame)
      : val,
  );
}

/**
 * Checks if key `b` partially matches with key `a`.
 */
export function partialMatchKey(a: ModalKey, b: ModalKey): boolean;
export function partialMatchKey(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return !Object.keys(b).some((key) => !partialMatchKey(a[key], b[key]));
  }

  return false;
}
