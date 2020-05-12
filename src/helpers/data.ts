/**
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
