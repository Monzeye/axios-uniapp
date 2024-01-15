import { isFunction, isObject, isDate, isArray } from './is'

export function bind(fn: (...args: any[]) => any, thisArg: object) {
  return function wrap(...args: any[]) {
    return fn.apply(thisArg, args)
  }
}

type CallBackFn<T> = (
  item: T extends Record<string | number, infer V> ? V : T,
  index: T extends object ? string : number,
  obj: T
) => void

function forEach<T>(obj: T, fn: CallBackFn<T>, { allOwnKeys = false } = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return
  }

  let i
  let l

  if (typeof obj !== 'object') {
    const arr: T[] = [obj]
    for (i = 0, l = arr.length; i < l; i++) {
      fn.call(
        null,
        arr[i] as T extends Record<string | number, infer V> ? V : T,
        i as T extends object ? string : number,
        obj
      )
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj)
    const len = keys.length
    let key: string

    for (i = 0; i < len; i++) {
      key = keys[i]
      fn.call(
        null,
        (obj as Record<string | number, any>)[key] as T extends Record<
          string | number,
          infer V
        >
          ? V
          : T,
        key as T extends object ? string : number,
        obj
      )
    }
  }
}

export function extend(
  a: Record<string, any>,
  b: Record<string, any>,
  thisArg: object | null,
  { allOwnKeys }: { allOwnKeys?: boolean } = {}
) {
  forEach(
    b,
    (val, key) => {
      if (thisArg && isFunction(val)) {
        a[key] = bind(val, thisArg)
      } else {
        a[key] = val
      }
    },
    { allOwnKeys }
  )
  return a
}

export function cloneDeep<T extends Record<string, any>>(obj: T): T {
  const newObj: Record<string, any> = {}
  for (const key in obj) {
    if (isObject(obj[key])) {
      newObj[key] = cloneDeep(obj[key])
    } else {
      newObj[key] = obj[key]
    }
  }
  return newObj as T
}

export function merge<
  T extends Record<string, any>,
  U extends Record<string, any>
>(obj1: T, obj2: U): T & U {
  const result = {} as T & U
  const obj = Object.assign({}, obj1, obj2)
  Object.keys(obj).forEach((key: keyof (T & U)) => {
    const val = obj[key]
    if (isObject(result[key]) && isObject(val)) {
      result[key] = merge(result[key], val)
    } else if (isObject(val)) {
      result[key] = merge({}, val)
    } else if (isArray(val)) {
      result[key] = val.slice()
    } else {
      result[key] = val
    }
  })
  return result
}

// ===========================================
export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

/**
 * 通过组合指定的URL创建新的URL
 * @param baseURL string
 * @param relativeURL
 * @returns
 */
export function combineURLs(baseURL: string, relativeURL: string) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL
}

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }

  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else {
    const parts: string[] = []

    Object.keys(params).forEach(key => {
      const val = params[key]
      if (val === null || typeof val === 'undefined') {
        return
      }
      let values = []
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }
      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })

    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

function encode(val: string) {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
