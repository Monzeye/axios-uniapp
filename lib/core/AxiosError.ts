import { AxiosRequestConfig, AxiosResponse, RequestTask } from '../types'

export default class AxiosError {
  name: string = 'AxiosError'
  stack?: string
  message: string
  code: string
  config?: AxiosRequestConfig
  request?: RequestTask
  response?: AxiosResponse
  constructor(
    message: string,
    code: string,
    config?: AxiosRequestConfig,
    request?: RequestTask,
    response?: AxiosResponse
  ) {
    const error = new Error(message)
    this.message = error.message
    this.code = code
    this.stack = error.stack
    config && (this.config = config)
    request && (this.request = request)
    response && (this.response = response)
  }
  toJSON() {
    return {
      message: this.message,
      name: this.name,
      stack: this.stack,
      // config: utils.toJSONObject(this.config),
      code: this.code,
      status:
        this.response && this.response.status ? this.response.status : null
    }
  }
  // static from(
  //   error: Error | AxiosError,
  //   code: { value: string },
  //   config: AxiosRequestConfig,
  //   request: RequestTask,
  //   response: AxiosResponse,
  //   customProps: Record<string, any>
  // ) {
  //   const axiosError = Object.create(AxiosError.prototype)
  //   AxiosError.call(error, error.message, code, config, request, response)
  //   customProps && Object.assign(axiosError, customProps)
  //   return axiosError
  // }
  static ERR_BAD_OPTION_VALUE = 'ERR_BAD_OPTION_VALUE'
  static ERR_BAD_OPTION = 'ERR_BAD_OPTION'
  static ECONNABORTED = 'ECONNABORTED'
  static ETIMEDOUT = 'ETIMEDOUT'
  static ERR_NETWORK = 'ERR_NETWORK'
  static ERR_FR_TOO_MANY_REDIRECTS = 'ERR_FR_TOO_MANY_REDIRECTS'
  static ERR_DEPRECATED = 'ERR_DEPRECATED'
  static ERR_BAD_RESPONSE = 'ERR_BAD_RESPONSE'
  static ERR_BAD_REQUEST = 'ERR_BAD_REQUEST'
  static ERR_CANCELED = 'ERR_CANCELED'
  static ERR_NOT_SUPPORT = 'ERR_NOT_SUPPORT'
  static ERR_INVALID_URL = 'ERR_INVALID_URL'
}
