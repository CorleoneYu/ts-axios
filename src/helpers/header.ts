import { isPlainObject, deepMerge } from './util'
import { Method } from '../type'

/**
 * request
 * 将 headers 中的 key 字段规范化
 * @param headers 头部配置
 * @param normalizedName 规范key
 */
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }

  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  // data 为纯对象 则默认为 json
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

/**
 * response
 * XMLHttpRequest 的 getAllResponseHeaders 得到的是字符串:
 * date: Fri, 05 Apr 2019 12:40:49 GMT
 * etag: W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"
 * connection: keep-alive
 * x-powered-by: Express
 * content-length: 13
 * content-type: application/json; charset=utf-8
 * 需要转换成对象
 */
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  // \r\n 作为分隔符
  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }

    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })

  return parsed
}

/**
 * 需要将 headers 中的字段进行扁平化处理 如下
 */
// headers: {
//   common: {
//     Accept: 'application/json, text/plain, */*'
//   },
//   post: {
//     'Content-Type':'application/x-www-form-urlencoded'
//   }
// }
// 处理成
// headers: {
//   Accept: 'application/json, text/plain, */*',
//  'Content-Type':'application/x-www-form-urlencoded'
// }
// 其中  common 需要公用，但 post get 等需要和特定请求方式对应
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }

  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodsToDelete: string[] = [
    'delete',
    'get',
    'head',
    'options',
    'post',
    'put',
    'patch',
    'common'
  ]

  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
