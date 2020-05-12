/**
 * 处理 url 参数拼接相关
 * 1. 数组
 * 2. 对象
 * 3. 日期
 * 4. 特殊字符
 * 5. 空值忽略
 * 6. url 中 hash 舍弃
 * 7. url 中原参数保留
 */

import { isDate, isPlainObject } from './util'

// 对于字符 @、:、$、,、、[、]
// 允许出现在 url 中的，不希望被 encode
// 空格会被换成 +
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any) {
  if (!params) {
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach(key => {
    let val = params[key]

    // 忽略值为 null | undefined 的参数
    if (val === null || typeof val === 'undefined') {
      return
    }

    let values: string[]
    if (Array.isArray(val)) {
      // 参数值为数组的情况下
      // 如： url: '/base/get' params: { foo: ['bar', 'baz']}
      // => url: /base/get?foo[]=bar&foo[]=baz
      values = val
      key += '[]'
    } else {
      values = [val]
    }

    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')

  if (serializedParams) {
    // 丢弃 url 上 hash 的 # 标志
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      // # 号后的都丢掉
      // 如： url: '/base/get#hash', => url: '/base/get'
      url = url.slice(0, markIndex)
    }

    if (url.indexOf('?') === -1) {
      url += '?'
    } else {
      url += '&'
    }

    url += serializedParams
  }

  return url
}
