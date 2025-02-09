import type { MyResult } from '~/helpers'

/**
 * Returns a repository function whose types can either be passed or
 * left to be inferred from the compiler.
 *
 * @example
 * ```typescript
 * const cityRepository = createRepository({
 *  query: async ({ name }: { name: string }): PromiseResult<City[]> => {
 *   ...
 * }})
 *
 * const repo = cityRepository()
 *
 * cityRepository.query('London') // => Throws a type error
 * cityRepository.query({ name: 'London' }) // => OK. Editor suggests the correct property
 *
 * ```
 */
export const createRepository = <TEntity, TQueryParams extends object>(
  repository: {
    query: (queryParams: TQueryParams) => Promise<MyResult<TEntity[]>>
  },
) =>
  () => repository
