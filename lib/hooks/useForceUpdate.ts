import { Reducer, useReducer } from 'react';

export const useForceUpdate = () => {
  const [forceUpdateState, forceUpdate] = useReducer<Reducer<boolean, void>>((state) => !state, false);

  return [forceUpdateState, forceUpdate] as const;
};
