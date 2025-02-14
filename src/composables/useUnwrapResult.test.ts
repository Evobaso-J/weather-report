import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { createErr } from 'option-t/plain_result'
import { BaseError } from '../helpers'

const toastAddMock = vi.hoisted(() => vi.fn())

const { useToastMock } = vi.hoisted(() => ({
  useToastMock: vi.fn(() => ({
    add: toastAddMock,
  })),
}))
const { useI18nMock } = vi.hoisted(() => ({
  useI18nMock: vi.fn(() => ({
    t: vi.fn((key: string) => key),
  })),
}))

mockNuxtImport('useToast', () => useToastMock)
mockNuxtImport('useI18n', () => useI18nMock)
mockNuxtImport('useId', () => () => 'id')

describe('useUnwrapResult', () => {
  it('should return the correct value', () => {
    const composableReturnValue = useUnwrapResult()

    expect(composableReturnValue).toEqual({
      unwrapResult: expect.any(Function),
    })
  })
  describe('unwrapResult', () => {
    it('should return an empty array if the parameter is null or undefined', () => {
      const { unwrapResult } = useUnwrapResult()

      const result = unwrapResult(null)

      expect(result).toEqual([])
    })
    it('should display the correct notification if the parameter is null or undefined', () => {
      const { unwrapResult } = useUnwrapResult()

      unwrapResult(null)

      expect(toastAddMock).toHaveBeenCalledWith({
        color: 'red',
        timeout: 3000,
        icon: 'i-mdi-alert-outline',
        id: 'id',
        title: 'error.noElementFound',
      })
    })
    it('should return an empty array if the parameter is an Err', () => {
      const { unwrapResult } = useUnwrapResult()

      const errMock = createErr(new BaseError({ name: 'error', message: 'error message' }))

      const result = unwrapResult(errMock)

      expect(result).toEqual([])
    })
    it('should display the correct notification if the parameter is an Err', () => {
      const { unwrapResult } = useUnwrapResult()

      const errMock = createErr(new BaseError({ name: 'error', message: 'error message' }))

      unwrapResult(errMock)

      expect(toastAddMock).toHaveBeenCalledWith({
        color: 'red',
        timeout: 3000,
        icon: 'i-mdi-alert-outline',
        id: 'id',
        title: 'error message',
      })
    })
  })
})
