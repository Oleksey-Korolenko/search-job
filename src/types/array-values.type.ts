export type arrayValuesToType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer arrayValuesToType> ? arrayValuesToType : never;
