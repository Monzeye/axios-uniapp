export function is(val: unknown, type: string) {
  return Object.prototype.toString.call(val) === `[object ${type}]`
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

export function isArray(val: unknown): val is [] {
  return is(val, 'Array')
}

export function isObject(val: unknown): val is object {
  return is(val, 'Object')
}

export function isUndefined(val: unknown): val is undefined {
  return is(val, 'Undefined')
}

export function isDate(val: unknown): val is Date {
  return is(val, 'Date')
}
