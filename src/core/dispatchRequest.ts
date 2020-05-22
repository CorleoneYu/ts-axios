import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../type'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/header'
import transform from './transform'
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

  // 2. data 处理
  config.data = transform(config.data, config.headers, config.transformRequest)

  // 3. 将 headers 中的字段扁平化
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 格式化 request url 参数相关带
function transformUrl(config: AxiosRequestConfig): string {
  const { url = '', params } = config
  return buildURL(url, params)
}

// 处理 response data 相关
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}
