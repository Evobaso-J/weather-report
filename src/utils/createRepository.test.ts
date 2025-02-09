import { createOk } from 'option-t/plain_result'
import { describe, expect, expectTypeOf, it } from 'vitest'

describe('createRepository', () => {
  it('should return a function', () => {
    const testRepository = createRepository({
      query: async ({ id }: { id: number }) => {
        return createOk([{ id, name: 'test' }])
      },
    })
    expect(typeof testRepository).toBe('function')
  })
  describe('the returned function should return a repository object', () => {
    const testRepository = createRepository({
      query: async ({ id }: { id: number }) => {
        return createOk([{ id, name: 'test' }])
      },
    })
    const repo = testRepository()

    it('should have a query function', () => {
      expect(typeof repo.query).toBe('function')
    })
  })

  describe('should infer the types of the query function', () => {
    const testRepository = createRepository({
      query: async ({ id }: { id: number }) => {
        return createOk([{ id, name: 'test' }])
      },
    })
    const repo = testRepository()

    it('should throw a type error if the query function is called with the wrong type', () => {
      expectTypeOf(repo.query).parameter(0).toMatchTypeOf<{ id: number }>()
    })
  })
})
