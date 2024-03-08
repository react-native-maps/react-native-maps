import { TAG } from './sharedTypes'
const RELEASE = true;

export function LWLog(...args: any[]) {
  if (RELEASE) {
    return;
  }
  console.log(TAG, args);
}

export function LWError(...args: any[]) {
  if (RELEASE) {
    return;
  }
  console.error(TAG, args)
}
