import axios, { AxiosError } from '../../src'
import NProgress from 'nprogress'
import qs from 'qs'

// 上传、下载监控
const instance = axios.create()

function calculatePercentage(loaded: number, total: number) {
  return Math.floor(loaded * 1.0) / total
}

function loadProgressBar() {
  const setupStartProgress = () => {
    instance.interceptors.request.use(config => {
      NProgress.start()
      return config
    })
  }

  const setupUpdateProgress = () => {
    const update = (e: ProgressEvent) => {
      console.log(e)
      NProgress.set(calculatePercentage(e.loaded, e.total))
    }
    instance.defaults.onDownloadProgress = update
    instance.defaults.onUploadProgress = update
  }

  const setupStopProgress = () => {
    instance.interceptors.response.use(
      response => {
        NProgress.done()
        return response
      },
      error => {
        NProgress.done()
        return Promise.reject(error)
      }
    )
  }

  setupStartProgress()
  setupUpdateProgress()
  setupStopProgress()
}

loadProgressBar()

const downloadEl = document.getElementById('download')

downloadEl!.addEventListener('click', e => {
  instance.get('https://img.mukewang.com/5cc01a7b0001a33718720632.jpg')
})

const uploadEl = document.getElementById('upload')

uploadEl!.addEventListener('click', e => {
  const data = new FormData()
  const fileEl = document.getElementById('file') as HTMLInputElement
  if (fileEl.files) {
    data.append('file', fileEl.files[0])

    instance.post('/more/upload', data)
  }
})

// http 授权
axios
  .post(
    '/more/post',
    {
      a: 1
    },
    {
      auth: {
        password: '123456',
        username: 'lky'
      }
    }
  )
  .then(res => {
    console.log(res)
  })

// 自定义合法状态码
axios
  .get('/more/304')
  .then(res => {
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log(e.message)
  })

axios
  .get('/more/304', {
    validateStatus(status) {
      return status >= 200 && status < 400
    }
  })
  .then(res => console.log(res))
  .catch((e: AxiosError) => {
    console.log(e.message)
  })

// 自定义参数序列化
axios
  .get('/more/get', {
    params: new URLSearchParams('a=b&c=d')
  })
  .then(res => {
    console.log(res)
  })

axios
  .get('/more/get', {
    params: {
      a: 1,
      b: 2,
      c: ['a', 'b', 'c']
    }
  })
  .then(res => {
    console.log(res)
  })

axios
  .get('/more/get', {
    params: {
      a: 1,
      b: 2,
      c: ['a', 'b', 'c']
    },
    paramsSerializer(params) {
      return qs.stringify(params, { arrayFormat: 'brackets' })
    }
  })
  .then(res => {
    console.log(res)
  })

// baseURL
const baseURLInstance = axios.create({
  baseURL: 'https://img.mukewang.com/'
})

baseURLInstance.get('5cc01a7b0001a33718720632.jpg')

baseURLInstance.get('https://img.mukewang.com/szimg/5becd5ad0001b89306000338-360-202.jpg')
