import { AxiosRequestConfig, RequestTask } from '../types'
import AxiosError from '../core/AxiosError'

export default class CanceledError extends AxiosError {
  name = 'CanceledError'
  __CANCEL__ = true
  constructor(
    message: string | undefined,
    config?: AxiosRequestConfig,
    request?: RequestTask
  ) {
    message = message == undefined ? 'canceled' : message
    super(message, AxiosError.ERR_CANCELED, config, request)
  }
}
