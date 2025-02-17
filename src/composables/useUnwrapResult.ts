import { isErr, unwrapErr, unwrapOk } from 'option-t/plain_result'
import type { MyResult } from '~/helpers'
import type { Notification } from '#ui/types'

/**
 * Provides a function to unwrap a result from option-t and handle errors.
 * In case of a nullish or Err value, a toast notification is shown to the end user.
 *
 * @param config - Optional configuration object.
 * @param config.silent - If true, suppresses error notifications.
 * @returns An object containing the unwrapResult function.
 */
export const useUnwrapResult = (config?: { silent: boolean }) => {
  const toast = useToast()
  const { t } = useI18n()
  const id = useId()

  const errorNotification: Partial<Notification> = {
    color: 'red',
    timeout: 3000,
    icon: 'i-mdi-alert-outline',
    id,
  }

  const unwrapResult = <T extends unknown[]>(myResult: MaybeRef<MyResult<T> | null | undefined>): T | [] => {
    const resultValue = toValue(myResult)
    if (!resultValue) {
      config?.silent || toast.add({
        ...errorNotification,
        title: t('error.noElementFound') })
      return []
    }
    if (isErr(resultValue)) {
      config?.silent || toast.add({ ...errorNotification, title: t(unwrapErr(resultValue).message) })
      return []
    }
    return unwrapOk(resultValue)
  }

  return {
    unwrapResult,
  }
}
