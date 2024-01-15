import type {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  Interceptors,
  RejectedFn,
  FulfilledFn,
  Method
} from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

class Axios {
  defaults: AxiosRequestConfig
  interceptors: Interceptors
  constructor(config: AxiosRequestConfig) {
    this.defaults = config
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }
  request<T>(
    configOrUrl: string | AxiosRequestConfig,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    if (typeof configOrUrl === 'string') {
      config = config || {}
      config.url = configOrUrl
    } else {
      config = configOrUrl || {}
    }
    config = mergeConfig(this.defaults, config)
    // @ts-ignore
    config.method = (
      config.method ||
      this.defaults.method ||
      'get'
    ).toUpperCase()

    if (!config.headers || typeof config.headers !== 'object') {
      config.headers = {
        'Content-Type': 'application/json'
      }
    }
    // ================================================
    const requestInterceptorChain: [
      FulfilledFn<AxiosRequestConfig>?,
      RejectedFn?
    ] = []
    // 后进先出
    this.interceptors.request.forEach(interceptor => {
      requestInterceptorChain.unshift(
        interceptor.fulfilled,
        interceptor.rejected
      )
    })
    // ================================================
    const responseInterceptorChain: [FulfilledFn<AxiosResponse>?, RejectedFn?] =
      []
    // 后进后出
    this.interceptors.response.forEach(interceptor => {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected)
    })
    // ================================================

    let promise: AxiosPromise<T>,
      len: number = requestInterceptorChain.length,
      i: number = 0
    let newConfig: AxiosRequestConfig = config
    // request请求前 拦截器队列触发
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++] as
        | FulfilledFn<AxiosRequestConfig>
        | undefined
      const onRejected = requestInterceptorChain[i++] as RejectedFn | undefined
      try {
        newConfig =
          (onFulfilled?.call(this, newConfig) as AxiosRequestConfig) ||
          newConfig
      } catch (error) {
        onRejected?.call(this, error)
        break
      }
    }
    // ================================================
    // 执行请求
    try {
      promise = (dispatchRequest<T>).call(this, newConfig)
    } catch (error) {
      return Promise.reject(error)
    }
    // ================================================
    i = 0
    len = responseInterceptorChain.length
    // request请求触发后 拦截器队列触发
    while (i < len) {
      promise = promise.then(
        responseInterceptorChain[i++],
        responseInterceptorChain[i++]
      )
    }

    return promise
  }

  get<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._requestMethodWithData('get', url, {}, config)
  }

  post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this._requestMethodWithData('post', url, data, config)
  }

  put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this._requestMethodWithData('put', url, data, config)
  }

  delete<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._requestMethodWithData('delete', url, {}, config)
  }

  connect<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this._requestMethodWithData('connect', url, data, config)
  }

  head<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._requestMethodWithData('head', url, {}, config)
  }

  options<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._requestMethodWithData('options', url, {}, config)
  }

  trace<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this._requestMethodWithData('trace', url, data, config)
  }

  download<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._requestMethodWithData('download', url, config?.data, config)
  }

  upload<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._requestMethodWithData(
      'upload',
      url,
      config?.data,
      config as AxiosRequestConfig
    )
  }

  private _requestMethodWithData(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(
        mergeConfig(config || {}, {
          method,
          url,
          data
        })
      )
    )
  }
}

export default Axios
