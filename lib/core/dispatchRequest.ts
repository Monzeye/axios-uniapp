import type { AxiosPromise, AxiosRequestConfig } from '../types'
import { isAbsoluteURL, combineURLs, buildURL } from '../utils'
import { xhr, upload, download } from './xhr'

function transformURL(config: AxiosRequestConfig): string {
  let { url } = config
  const { params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURLs(baseURL, url!)
  }
  return buildURL(url!, params, paramsSerializer)
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}

export default function dispatchRequest<T = any, D = any>(
  config: AxiosRequestConfig<D>
): AxiosPromise<T> {
  throwIfCancellationRequested(config)
  processConfig(config)
  function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config)
    // config.data = transform(config.data, config.headers, config.transformRequest)
    // config.headers = flattenHeaders(config.headers, config.method!)
  }

  const METHODS = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'CONNECT',
    'HEAD',
    'OPTIONS',
    'TRACE'
  ]
  const UPLOAD = 'UPLOAD'
  const DOWNLOAD = 'DOWNLOAD'

  let xhrRequest: <T, D>(config: AxiosRequestConfig<D>) => AxiosPromise<T> = xhr

  if (METHODS.indexOf(config.method!) !== -1) {
    xhrRequest = xhr
  }
  if (config.method === DOWNLOAD) {
    xhrRequest = download
  }
  if (config.method === UPLOAD) {
    xhrRequest = upload
  }

  return xhrRequest(config)
}
