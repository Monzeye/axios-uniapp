import type { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import CanceledError from '../cancel/CanceledError'
import AxiosError from './AxiosError'

export function xhr<T = any, D = any>(
  config: AxiosRequestConfig<D>
): AxiosPromise<T> {
  let instance: UniNamespace.RequestTask
  const { method, url, headers, cancelToken, ...otherConfig } = config
  let onCanceled: (cancel: CanceledError) => void
  function done() {
    if (cancelToken) {
      cancelToken.unsubscribe(onCanceled)
    }
  }
  return new Promise<AxiosResponse<T>>((resolve, reject) => {
    if (cancelToken) {
      onCanceled = cancel => {
        if (!instance) {
          return
        }
        reject(
          !cancel ? new CanceledError(undefined, config, instance) : cancel
        )
        instance.abort()
        instance = null!
      }
      cancelToken?.subscribe(onCanceled)
    }
    instance = uni.request({
      ...otherConfig,
      url: url!,
      // @ts-ignore
      method: method!,
      dataType: 'json',
      header: headers,
      success(result: UniNamespace.RequestSuccessCallbackResult) {
        const response: AxiosResponse<T> = {
          cookies: result.cookies,
          data: result.data as T,
          status: Number(result.statusCode),
          headers: headers,
          config,
          request: instance
        }
        settle(
          function (value) {
            resolve(value)
            done()
          },
          function (err) {
            reject(err)
            done()
          },
          response
        )
      },
      fail(err) {
        reject(
          new AxiosError(
            'Network Error',
            AxiosError.ERR_NETWORK,
            config,
            instance
          )
        )
        done()
      }
    }) as unknown as UniNamespace.RequestTask
  })
}

// 上传
export function upload<T = any, D = any>(
  config: AxiosRequestConfig<D>
): AxiosPromise<T> {
  let instance: UniNamespace.UploadTask
  const { method, url, headers, cancelToken, upload, ...otherConfig } = config
  let onCanceled: (cancel: CanceledError) => void
  function done() {
    if (cancelToken) {
      cancelToken.unsubscribe(onCanceled)
    }
  }
  return new Promise<AxiosResponse<T>>((resolve, reject) => {
    if (cancelToken) {
      onCanceled = cancel => {
        if (!instance) {
          return
        }
        reject(
          !cancel ? new CanceledError(undefined, config, instance) : cancel
        )
        instance.abort()
        instance = null!
      }
      cancelToken?.subscribe(onCanceled)
    }
    instance = uni.uploadFile({
      ...otherConfig,
      ...upload,
      url: url!,
      header: headers,
      success: (result: UniNamespace.UploadFileSuccessCallbackResult) => {
        const response: AxiosResponse<T> = {
          status: Number(result.statusCode),
          data: result.data as T,
          headers: headers,
          config,
          request: instance
        }
        settle(
          function (value) {
            resolve(value)
            done()
          },
          function (err) {
            reject(err)
            done()
          },
          response
        )
      },
      fail: err => {
        reject(
          new AxiosError(
            'Network Error',
            AxiosError.ERR_NETWORK,
            config,
            instance
          )
        )
        done()
      }
    })
    if (cancelToken?.reason) {
      instance.abort()
    }
    instance.onProgressUpdate((result: UniNamespace.OnProgressUpdateResult) => {
      config.onUploadProgress && config.onUploadProgress(result)
    })
  })
}

// 下载
export function download<T = any, D = any>(
  config: AxiosRequestConfig<D>
): AxiosPromise<T> {
  let instance: UniNamespace.DownloadTask
  const { method, url, headers, cancelToken, download, ...otherConfig } = config
  let onCanceled: (cancel: CanceledError) => void
  function done() {
    if (cancelToken) {
      cancelToken.unsubscribe(onCanceled)
    }
  }
  return new Promise<AxiosResponse<T>>((resolve, reject) => {
    if (cancelToken) {
      onCanceled = cancel => {
        if (!instance) {
          return
        }
        reject(
          !cancel ? new CanceledError(undefined, config, instance) : cancel
        )
        instance.abort()
        instance = null!
      }
      cancelToken?.subscribe(onCanceled)
    }
    instance = uni.downloadFile({
      ...otherConfig,
      ...download,
      url: url!,
      header: headers,
      success: (result: UniNamespace.DownloadSuccessData) => {
        const response: AxiosResponse<T> = {
          status: Number(result.statusCode),
          data: result.tempFilePath as T,
          headers: headers,
          config,
          request: instance
        }
        settle(
          function (value) {
            resolve(value)
            done()
          },
          function (err) {
            reject(err)
            done()
          },
          response
        )
      },
      fail: err => {
        reject(
          new AxiosError(
            'Network Error',
            AxiosError.ERR_NETWORK,
            config,
            instance
          )
        )
        done()
      }
    })
    instance.onProgressUpdate(
      (result: UniNamespace.OnProgressDownloadResult) => {
        config.onDownloadProgress && config.onDownloadProgress(result)
      }
    )
  })
}

function settle(
  resolve: (d: AxiosResponse) => void,
  reject: (d: AxiosError) => void,
  response: AxiosResponse
) {
  const validateStatus = response.config.validateStatus
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response)
  } else {
    reject(
      new AxiosError(
        'Request failed with status code ' + response.status,
        [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][
          Math.floor(response.status / 100) - 4
        ],
        response.config,
        response.request,
        response
      )
    )
  }
}
