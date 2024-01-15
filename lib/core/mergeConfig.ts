import type { AxiosRequestConfig, UploadRequestConfig } from '../types'
import { isUndefined, isObject, isArray } from '../utils/is'
import { merge } from '../utils'

export default function mergeConfig<T = any>(
  config1: AxiosRequestConfig<T>,
  config2: AxiosRequestConfig<T> = {}
): AxiosRequestConfig<T> {
  const config: AxiosRequestConfig<T> = {}
  // 配置项合并 优先取source值
  function getMergedValue(target: unknown, source: unknown, caseless?: string) {
    if (isObject(target) && isObject(source)) {
      return merge.bind({ caseless }, target, source)
    } else if (isObject(source)) {
      return merge({}, source)
    } else if (isArray(source)) {
      return source.slice()
    }
    return source
  }
  /**
   *
   * @param a
   * @param b
   * @returns
   */
  function valueFromConfig2(a: unknown, b: unknown) {
    if (!isUndefined(b)) {
      return getMergedValue(undefined, b)
    }
  }

  function defaultToConfig2(a: unknown, b: unknown) {
    if (!isUndefined(b)) {
      return getMergedValue(undefined, b)
    } else if (!isUndefined(a)) {
      return getMergedValue(undefined, a)
    }
  }

  function mergeDirectKeys(a: unknown, b: unknown, prop: string) {
    if (prop in config2!) {
      return getMergedValue(a, b)
    } else if (prop in config1) {
      return getMergedValue(undefined, a)
    }
  }
  function chooseConfig(a: unknown, b: unknown) {
    if (!isUndefined(b)) {
      return b
    } else if (!isUndefined(a)) {
      return a
    }
  }

  const mergeMap: {
    [protype in keyof AxiosRequestConfig<T>]: any
  } = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,

    upload: defaultToConfig2,
    download: defaultToConfig2,

    params: defaultToConfig2,
    headers: defaultToConfig2,
    responseType: defaultToConfig2,
    dataType: defaultToConfig2,
    sslVerify: defaultToConfig2,
    timeout: defaultToConfig2,
    withCredentials: defaultToConfig2,
    defer: defaultToConfig2,
    cloudCache: defaultToConfig2,
    enableCookie: defaultToConfig2,
    forceCellularNetwork: defaultToConfig2,
    enableChunked: defaultToConfig2,
    enableHttpDNS: defaultToConfig2,
    httpDNSServiceId: defaultToConfig2,
    enableCache: defaultToConfig2,
    enableQuic: defaultToConfig2,
    enableHttp2: defaultToConfig2,
    firstIpv4: defaultToConfig2,
    // transformRequest?: AxiosTransformer | AxiosTransformer[]
    // transformResponse?: AxiosTransformer | AxiosTransformer[]
    cancelToken: chooseConfig,
    validateStatus: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    baseURL: defaultToConfig2
  }
  ;(
    Object.keys(
      Object.assign({}, config1, config2)
    ) as unknown as (keyof AxiosRequestConfig<T>)[]
  ).forEach(prop => {
    const merge = mergeMap[prop]
    const configValue = merge(config1[prop], config2[prop], prop)
    ;(isUndefined(configValue) && merge !== mergeDirectKeys) ||
      (config[prop] = configValue)
  })

  return config
}
