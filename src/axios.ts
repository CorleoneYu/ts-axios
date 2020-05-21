import { AxiosInstance, AxiosRequestConfig } from './type'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'

/**
 * 混合对象的实现
 * instance
 * 1. 可以作为方法调用 实际上是调用到 Axios.request
 * Axios({
 * instance// ..config
 * })
 * 2. 可以使用 Axios 的方法, 因为 extend 将 Axios 的属性、方法挂上去了
 * instance.get({
 *  // ..config
 * })
 * 很骚的做法
 */
function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return instance as AxiosInstance
}

const axios = createInstance(defaults)

export default axios
