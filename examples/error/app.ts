import axios, { AxiosError } from '../../src/index';

// 404 error
axios({
  method: 'get',
  url: '/error/get1'
}).then((res) => {
  console.log(res);
}).catch((e: AxiosError) => {
  console.log(e.message)
  console.log(e.code)
})

// 有几率 500
axios({
  method: 'get',
  url: '/error/get'
}).then(res => {
  console.log(res);
}).catch(e => {
  console.log(e);
})

// 有几率 500
setTimeout(() => {
  axios({
    method: 'get',
    url: '/error/get',
  }).then(res => {
    console.log(res);
  }).catch(e => {
    console.log(e);
  })
}, 5000);

// timeout
axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000,
}).then(res => {
  console.log(res);
}).catch(e => {
  console.log(e);
})