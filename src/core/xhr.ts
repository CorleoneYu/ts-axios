import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../type'
import { parseHeaders } from '../helpers/header'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url = '',
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth
    } = config

    const request = new XMLHttpRequest()

    // 2. 初始化 request
    request.open(method.toUpperCase(), url, true)

    // 3. 配置 request 对象
    configureRequest()

    // 4. 给 request 添加各种事件
    addEvents()

    // 5. 处理 headers
    processHeaders()

    // 6. 处理请求取消逻辑
    processCancel()

    // 7. 发送请求
    request.send(data)

    function configureRequest() {
      if (responseType) {
        request.responseType = responseType
      }

      if (withCredentials) {
        request.withCredentials = withCredentials
      }

      // 超时处理
      if (timeout) {
        request.timeout = timeout
      }
    }

    function addEvents() {
      // 1. 2. 3. 4 各个阶段都会触发
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }

        if (request.status === 0) {
          // 网络错误、超时错误时 该值为 0
          return
        }

        function handleResponse(response: AxiosResponse) {
          if (response.status >= 200 && response.status < 300) {
            resolve(response)
          } else {
            reject(
              createError(
                `Request failed with status code ${response.status}`,
                config,
                null,
                request,
                response
              )
            )
          }
        }

        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData =
          responseType && responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }

      // 错误处理
      request.onerror = function handleError(e) {
        console.log('e', e)
        reject(createError('Network Error', config, null, request))
      }

      // 超时处理
      request.ontimeout = function handleTimeout() {
        reject(
          createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request)
        )
      }

      // 上传、下载进度
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders() {
      /**
       * 如果请求的数据是 FormData 类型，我们应该主动删除请求 headers 中的 Content-Type 字段
       * 让浏览器自动根据请求数据设置 Content-Type。
       * 比如当我们通过 FormData 上传文件的时候，
       * 浏览器会把请求 headers 中的 Content-Type 设置为 multipart/form-data。
       */
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      /**
       * xsrf 防御
       * 服务器生成 token 并种在 cookie 中带到客户端
       * 客户端发送请求时：
       * 1. 从 cookie 中读取该 token 值
       * 2. 写入 headers 中
       * 服务端接收请求时：
       * 1. 从 headers 中读取该 token 值
       * 2. 验证 token
       */
      if (xsrfCookieName && (withCredentials || isURLSameOrigin(url))) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue) {
          headers[xsrfHeaderName!] = xsrfValue
        }
      }

      /**
       * http 授权
       */
      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      Object.keys(headers).forEach(name => {
        // data 为空时 content-type 没有意义
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel() {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }
  })
}
