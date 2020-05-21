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

/**
 * 混合对象的实现
 * 需要一种值，具有
 * 1. 首先他是个函数
 * 2. 他又有某种类的所有原型属性和实例属性
 * 场景： Axios
 * 1. 可以当作函数调用 Axios({
 *  // ..config
 * })
 * 2. 可以使用 Axios 的方法
 * Axios.get({
 *  // ..config
 * })
 */
export function extend<T, U>(to: T, from: U): T & U {
  // 将 from 的属性、方法 拓展到 to 中
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

/**
 * deep 合并对象
 * @param objs 需要合并的对象
 */
export function deepMerge(...objs: any[]): any {
  const res = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]

        if (isPlainObject(val)) {
          if (isPlainObject(res[key])) {
            // 递归调用
            res[key] = deepMerge(res[key], val)
          } else {
            res[key] = deepMerge({}, val)
          }
        } else {
          res[key] = val
        }
      })
    }
  })

  return res
}
