import { useSyncExternalStore } from 'react';

const emptySubscribe = () => {return () => {}};

export function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => {return true}, () => {return false});
}
