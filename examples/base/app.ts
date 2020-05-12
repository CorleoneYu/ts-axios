import axios from '../../src/index'

// 1. 数组
axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: ['bar', 'baz']
  }
})

// 2. 对象
axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: {
      bar: 'baz'
    }
  }
})

// 3. 日期
const date = new Date()
axios({
  method: 'get',
  url: '/base/get',
  params: {
    date
  }
})

// 4. 特殊字符
axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: '@:$, '
  }
})

// 5. 空值忽略
axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: 'bar',
    baz: null
  }
})

// 6. hash 舍弃
axios({
  method: 'get',
  url: '/base/get#hash',
  params: {
    foo: 'bar'
  }
})

// 7. 原参数保留
axios({
  method: 'get',
  url: '/base/get?foo=bar',
  params: {
    bar: 'baz'
  }
})