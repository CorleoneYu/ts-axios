export interface AxiosRequestConfig {
  // url?: string
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number // 超时限制

  // 请求、响应配置化
  // 请求拦截器 -> 请求配置函数 -> 响应配置函数 -> 响应拦截器
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]

  cancelToken?: CancelToken // 取消请求
  withCredentials?: boolean // 跨域是否发送 cookie

  // xsrf-token
  xsrfCookieName?: string
  xsrfHeaderName?: string

  // 上传/下载进度监控
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void

  // http 授权
  auth?: AxiosBasicCredentials

  // 自定义合法状态码
  validateStatus?: (status: number) => boolean

  [propName: string]: any
}

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

// 手动暴露出来给外界使用
// axios 内部则使用 class 定义的 AxiosError
export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean
}

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

export interface Axios {
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  defaults: AxiosRequestConfig
}

// 混合类型 可以使用 Axios 实例属性 又可以作为函数
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  // 函数重载
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 静态属性
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
}

// 拦截器管理
export interface AxiosInterceptorManager<T> {
  use(resolve: ResolvedFn<T>, reject?: RejectedFn): number

  eject(id: number): void
}

export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface Canceler {
  (reason?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

// CancelToken 实例类型
export interface CancelToken {
  promise: Promise<string>
  reason?: Cancel

  throwIfRequested(): void
}

// CancelToken 静态类型
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken

  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message?: string): Cancel
}

// http 授权
export interface AxiosBasicCredentials {
  username: string
  password: string
}
