import axios from '../../src/index'

axios.interceptors.request.use(config => {
  console.log('请求拦截器');
  config.headers.test += '1'
  return config
})

axios.interceptors.request.use(config => {
  config.headers.test += '2'
  return config
})

axios.interceptors.request.use(config => {
  config.headers.test += '3'
  return config
})

axios.interceptors.response.use(res => {
  console.log('响应拦截器');
  res.data += '1'
  return res
})

const i = axios.interceptors.response.use(res => {
  res.data += '2'
  return res
}) 

axios.interceptors.response.use(res => {
  res.data += 3
  return res
})

axios.interceptors.response.eject(i)

axios({
  url: '/interceptor/get',
  method: 'get',
  headers: {
    test: ''
  }
}).then(res => {
  console.log('res', res);
});
