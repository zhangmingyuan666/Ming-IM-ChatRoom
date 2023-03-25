// 推断某个对象的所有 Functional keys
export type MethodKeys<O extends {}> = {
    [key in keyof O]: O[key] extends Function ? key : never;
  }[keyof O];
  
  export const patchMethod = <O extends {}, K extends MethodKeys<O>, P extends any[]>(
    obj: O,
    key: K,
    patchFn: (origin: O[K], ...params: P) => O[K] & Function
  ) => {
    return (...params: P) => {
      // eslint-disable-next-line no-param-reassign
      obj[key] = patchFn(obj[key], ...params);
    };
  };