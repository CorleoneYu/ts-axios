import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../type'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders } from '../helpers/header'
import xhr from './xhr'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  // 1. url 处理
  config.url = transformUrl(config)

  // 2. header 处理
  // 的格式化依赖于 data 所以需要在 data 前
  config.headers = transformHeaders(config)

  // 3. data 处理
  config.data = transformRequestData(config)
}

// 格式化 request url 参数相关带
function transformUrl(config: AxiosRequestConfig): string {
  const { url = '', params } = config
  return buildURL(url, params)
}

// 格式化 request data 相关
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

// 格式化 request header 相关
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

// 处理 response data 相关
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}
