/**
 * request
 * 处理 body 中 data 相关
 * 1. 纯对象
 */

import { isPlainObject } from './util'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }

  return data
}

/**
 * response
 * 当返回数据是字符串串类型时，尝试转换成 json
 */
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // nothing
    }
  }
  return data
}
