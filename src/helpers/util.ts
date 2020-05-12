const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

/**
 * 与 isObject 不同的是 isPlainObject 更严格
 * FormData ArrayBuffer 等 isObject 判断为 true 但 isPlainObject 为 false
 * @param val 需要判断的值
 */
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
