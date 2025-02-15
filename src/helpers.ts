import type { Result } from 'option-t/plain_result'

export class BaseError<T extends string> extends Error {
  override name: T
  override message: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override cause: any
  statusCode: number

  constructor({
    name,
    message,
    cause,
    statusCode = 500,
  }: {
    name: T
    message: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cause?: any
    statusCode?: number
  }) {
    super()
    this.name = name
    this.message = message
    this.cause = cause
    this.statusCode = statusCode
  }
}

type TupleHelper<T, N extends number, U extends unknown[]> = U['length'] extends N ? U : TupleHelper<T, N, [T, ...U]>
export type Tuple<T, N extends number> = N extends number ?
  number extends N ?
    T[]
    : TupleHelper<T, N, []>
  : never

export type MyResult<T> = Result<T, BaseError<string>>

export type SnakeToCamel<S extends string> = S extends `${infer F}_${infer R}` ? `${Lowercase<F>}${Capitalize<SnakeToCamel<R>>}` : S
