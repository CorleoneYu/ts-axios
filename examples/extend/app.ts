import axios from '../../src/index'

// 作为函数调用 实际上调用到了 Axios.request
axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
})

// 函数重载调用
axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'hi'
  }
})

// 作为 Axios 实例调用 
axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hello'
  }
})

axios.get('/extend/get')

axios.options('/extend/options')

axios.delete('/extend/delete')

axios.head('/extend/head')

axios.post('/extend/post', { msg: 'post' })

axios.put('/extend/put', { msg: 'put' })

axios.patch('/extend/patch', { msg: 'patch' })
