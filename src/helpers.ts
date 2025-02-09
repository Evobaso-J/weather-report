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

export type MyResult<T> = Result<T, BaseError<string>>

export type APIResponse<T> = {
  generationtime_ms: number
  results: T[]
}
