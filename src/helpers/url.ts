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

import { isDate, isPlainObject, isURLSearchParams } from './util'

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

export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string) {
  if (!params) {
    return url
  }

  let serializedParams

  if (paramsSerializer) {
    // 使用用户自定义参数序列化
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    // 如果是 URLSearchParams 则直接调用  toString
    serializedParams = params.toString()
  } else {
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

    serializedParams = parts.join('&')
  }

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

interface URLOrigin {
  protocol: string
  host: string
}

// 同域名的判断主要利用了一个技巧
// 1. 创建一个 a 标签的 DOM，
// 2. 设置 href 属性为我们传入的 url
// 就可以获取该 DOM 的 protocol、host。
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.host === currentOrigin.host && parsedOrigin.protocol === currentOrigin.protocol
  )
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}

/**
 * 判断是否是绝对请求 url
 * 例如：
 * https:baidu.com 是绝对路径
 * /user/get 不是绝对路径
 * @param url
 */
export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}
