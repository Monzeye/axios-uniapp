// import CancelError from '../cancel/CancelError'
import AxiosError from '../core/AxiosError'
import CancelToken from '../cancel/CancelToken'
import type InterceptorManager from '../core/InterceptorManager'
import CanceledError from '../cancel/CanceledError'

export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'delete'
  | 'DELETE'
  | 'connect'
  | 'CONNECT'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'trace'
  | 'TRACE'
  | 'upload'
  | 'UPLOAD'
  | 'download'
  | 'DOWNLOAD'

export interface AxiosRequestConfig<D = any> {
  url?: string
  method?: Method | string
  baseURL?: string
  params?: any
  upload?: UploadRequestConfig<D>
  download?: DownloadRequestConfig
  data?: D
  headers?: UniNamespace.RequestOptions['header']
  responseType?: UniNamespace.RequestOptions['responseType'] &
    XMLHttpRequestResponseType
  dataType?: string
  sslVerify?: boolean
  timeout?: number
  withCredentials?: boolean
  defer?: boolean
  cloudCache?: boolean | object
  enableCookie?: boolean
  forceCellularNetwork?: boolean
  enableChunked?: boolean
  enableHttpDNS?: boolean
  httpDNSServiceId?: string
  enableCache?: string
  enableQuic?: string
  enableHttp2?: string
  firstIpv4?: string
  // transformRequest?: AxiosTransformer | AxiosTransformer[]
  // transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken
  paramsSerializer?: (params: any) => string
  validateStatus?: (status: number) => boolean
  onDownloadProgress?: (e: UniNamespace.OnProgressDownloadResult) => void
  onUploadProgress?: (e: UniNamespace.OnProgressUpdateResult) => void
}

export interface UploadRequestConfig<D = any> {
  name: string
  formData?: D
  fileType?: 'image' | 'video' | 'audio' | undefined
  files?: { name?: string; file?: File; uri: string }[]
  file?: File
  filePath?: string
}
export interface DownloadRequestConfig {
  filePath: string
}

export interface AxiosResponse<T = any, D = any> {
  cookies?: string[]
  data: T
  status: number
  headers: Record<string, any>
  config: AxiosRequestConfig<D>
  request: RequestTask
}

export interface FulfilledFn<T> {
  (val: T): T | Promise<T>
}
export interface RejectedFn {
  (error: unknown): any
}
export interface InterceptorHandler<T> {
  fulfilled: FulfilledFn<T>
  rejected?: RejectedFn
}

export type RequestTask =
  | UniNamespace.RequestTask
  | UniNamespace.UploadTask
  | UniNamespace.DownloadTask

export interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface Canceler {
  (message?: string, config?: AxiosRequestConfig, request?: RequestTask): void
}
