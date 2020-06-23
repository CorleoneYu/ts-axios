import axios from '../../src/index'
// import './test'
// import './gen-es5'
import './gen-my'

axios({
  method: 'get',
  url: '/simple/get',
  params: {
    a: 1,
    b: 2
  }
})