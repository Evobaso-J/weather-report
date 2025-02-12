import { describe, expectTypeOf, it } from 'vitest'
import type { Tuple } from './helpers'

describe('helpers', () => {
  describe('Tuple', () => {
    it('should return a tuple of n elements of type T', () => {
        type StringTuple = Tuple<string, 3>
        type MixedTuple = Tuple<string | number, 3>

        expectTypeOf<StringTuple>().toEqualTypeOf<[string, string, string]>()
        expectTypeOf<MixedTuple>().toEqualTypeOf<[string | number, string | number, string | number]>()
    })
    it('if number is passed as N type, should return an array of T', () => {
        type StringTuple = Tuple<string, number>
        expectTypeOf<StringTuple>().toEqualTypeOf<string[]>()
    })
    it('should return an empty tuple if N is 0', () => {
        type StringTuple = Tuple<string, 0>
        expectTypeOf<StringTuple>().toEqualTypeOf<[]>
    })
  })
})
