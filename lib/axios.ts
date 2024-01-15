import type {
  AxiosPromise,
  // AxiosPromise,
  AxiosRequestConfig
} from './types'
import Axios from './core/Axios'

import defaults from './defaults'
// import mergeConfig from './core/mergeConfig'

import CancelToken from './cancel/CancelToken'
import CanceledError from './cancel/CanceledError'
import isCancel from './cancel/isCancel'
import AxiosError from './core/AxiosError'
import mergeConfig from './core/mergeConfig'
import { bind, extend } from './utils'

export * from './types'

type AxiosFn = {
  <T>(
    configOrUrl: string | AxiosRequestConfig,
    config?: AxiosRequestConfig | undefined
  ): AxiosPromise<T>
  Axios: typeof Axios
  CancelToken: typeof CancelToken
  CanceledError: typeof CanceledError
  isCancel: typeof isCancel
  AxiosError: typeof AxiosError
  create: (config: AxiosRequestConfig) => AxiosFn
  all: (promises: Promise<any>[]) => Promise<any[]>
} & Axios

function createInstance(defaultConfig: AxiosRequestConfig) {
  const context = new Axios(defaultConfig)
  const instance = bind(Axios.prototype.request, context)
  extend(instance, Axios.prototype, context, { allOwnKeys: true })
  extend(instance, context, null, { allOwnKeys: true })
  // @ts-ignore
  instance.create = function (instanceConfig: AxiosRequestConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig))
  }
  return instance as unknown as AxiosFn
}

const axios = createInstance(defaults)

axios.Axios = Axios

axios.CancelToken = CancelToken
axios.CanceledError = CanceledError
axios.isCancel = isCancel

axios.AxiosError = AxiosError

axios.all = (promises: Promise<any>[]) => Promise.all(promises)

export default axios
