import { AxiosRequestConfig } from '../type'
import { isPlainObject, deepMerge } from '../helpers/util'

const strateMap: any = {}

// 默认合并策略
function defaultStrate(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 只接受用户配置的合并策略
const strateKeysFromVal2 = ['url', 'params', 'data']
function fromVal2Strate(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}
strateKeysFromVal2.forEach(key => {
  strateMap[key] = fromVal2Strate
})

// 复杂对象合并策略
const strateKeysDeepMerge = ['headers']
function deepMergeStrate(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}
strateKeysDeepMerge.forEach(key => {
  strateMap[key] = deepMergeStrate
})

/**
 *
 * @param config1 默认配置
 * @param config2 可能为用户传递的配置
 */
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2: AxiosRequestConfig = {}
): AxiosRequestConfig {
  const config = Object.create(null)

  // 用户配置优先级高
  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strate = strateMap[key] || defaultStrate
    config[key] = strate(config1[key], config2[key])
  }

  return config
}
