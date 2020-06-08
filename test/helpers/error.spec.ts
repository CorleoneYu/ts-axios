import { createError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/type'

describe('helpers: error', () => {
  test('should create an Error', () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      request,
      config,
      status: 200,
      statusText: 'OK',
      headers: null,
      data: { foo: 'bar' }
    }
    const error = createError('Boom', config, 'ERROR', request, response)

    expect(error instanceof Error).toBeTruthy()
    expect(error.message).toBe('Boom')
    expect(error.config).toBe(config)
    expect(error.code).toBe('ERROR')
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
    expect(error.isAxiosError).toBeTruthy()
  })
})
