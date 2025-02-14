import { isErr, unwrapErr, unwrapOk } from 'option-t/plain_result'
import type { MyResult } from '~/helpers'
import type { Notification } from '#ui/types'

export const useUnwrapResult = () => {
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
      toast.add({
        ...errorNotification,
        title: t('error.noElementFound') })
      return []
    }
    if (isErr(resultValue)) {
      toast.add({ ...errorNotification, title: unwrapErr(resultValue).message })
      return []
    }
    return unwrapOk(resultValue)
  }

  return {
    unwrapResult,
  }
}
