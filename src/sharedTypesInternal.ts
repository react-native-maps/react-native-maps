export type Modify<T, R> = Omit<T, keyof R> & R;
