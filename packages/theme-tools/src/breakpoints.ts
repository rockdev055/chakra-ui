export interface BaseBreakpointConfig extends Record<string, string> {
  sm: string
  md: string
  lg: string
  xl: string
}

export type Breakpoints<T = BaseBreakpointConfig> = string[] & WithBase<T>
export type WithBase<T> = T & { base: "0em" }

export const createBreakpoints = <T extends BaseBreakpointConfig>(
  config: T,
): Breakpoints<T> => {
  const sorted = Object.fromEntries(
    Object.entries({ base: "0em", ...config }).sort((a, b) =>
      parseInt(a[1]) > parseInt(b[1]) ? 1 : -1,
    ),
  ) as WithBase<T>

  return Object.assign(Object.values(sorted), sorted)
}
