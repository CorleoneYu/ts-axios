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

// 泛型
interface ResponseData<T = any> {
  code: number
  result: T
  message: string
}

interface User {
  name: string,
  age: number
}

function getUser<T>() {
  return axios<ResponseData<T>>('/extends/user')
  .then(res => res.data)
  .catch(err => console.log(err))
}

async function test() {
  const user = await getUser<User>()
  console.log('user', user);
}

test();