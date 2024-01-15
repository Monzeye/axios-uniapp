import type { Canceler } from '../types'

import CanceledError from './CanceledError'

interface ResolvePromise {
  (reason?: CanceledError): void
}

export default class CancelToken {
  promise: Promise<CanceledError>
  reason?: CanceledError
  _listeners: ((reason: CanceledError) => void)[] | undefined
  constructor(executor: (cancel: Canceler) => void) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.')
    }
    let resolvePromise: ResolvePromise
    this.promise = new Promise<CanceledError>(resolve => {
      // @ts-ignore
      resolvePromise = resolve
    })

    this.promise.then(cancel => {
      if (!this._listeners) return
      let i = this._listeners.length
      while (i-- > 0) {
        this._listeners[i](cancel)
      }
      this._listeners = null!
    })

    executor((message, config, request) => {
      if (this.reason) {
        return
      }
      this.reason = new CanceledError(message, config, request)
      resolvePromise(this.reason)
    })
  }

  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason
    }
  }

  subscribe(listener: (reason: CanceledError) => void) {
    if (this.reason) {
      console.log('立马调用取消')
      listener(this.reason)
      return
    }

    if (this._listeners) {
      this._listeners.push(listener)
    } else {
      this._listeners = [listener]
    }
  }

  unsubscribe(listener: (reason: CanceledError) => void) {
    if (!this._listeners) {
      return
    }
    const index = this._listeners.indexOf(listener)
    if (index !== -1) {
      this._listeners.splice(index, 1)
    }
  }

  static source() {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
