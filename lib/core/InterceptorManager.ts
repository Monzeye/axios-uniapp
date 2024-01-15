import type { RejectedFn, FulfilledFn, InterceptorHandler } from '../types'

export default class InterceptorManager<T> {
  private handlers: Array<InterceptorHandler<T> | null>
  constructor() {
    this.handlers = []
  }
  use(fulfilled: FulfilledFn<T>, rejected?: RejectedFn): number {
    this.handlers.push({
      fulfilled,
      rejected
    })
    return this.handlers.length - 1
  }
  eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null
    }
  }
  clear() {
    if (this.handlers) {
      this.handlers = []
    }
  }
  forEach(fn: (interceptor: InterceptorHandler<T>) => void): void {
    this.handlers.forEach(interceptor => {
      if (interceptor) {
        fn(interceptor)
      }
    })
  }
}
