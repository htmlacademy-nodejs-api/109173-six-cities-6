export interface Config<S> {
  get<T extends keyof S>(param: T): S[T];
}
