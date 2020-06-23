import axios, { AxiosResponse, AxiosError } from '../src/index';
import { getAjaxRequest } from './helper';

describe('request', () => {
  beforeEach(() => {
    jasmine.Ajax.install();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
  });

  test('should treat single string arg as url', () => {
    axios('/foo').then(res => console.log('res', res));

    // 异步测试 返回 promise resolve 后测试结束
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo');
      expect(request.method).toBe('GET');
    });
  });

  // POST -> post
  test('should treat method value as lowercase string', () => {
    axios({
      url: '/foo',
      method: 'POST'
    }).then(response => {
      // 2. response status 为 200
      expect(response.config.method).toBe('post');
    });

    return getAjaxRequest().then(request => {
      // 1. 捕获 request 后
      // 返回 200
      request.respondWith({
        status: 200
      });
    });
  });

  test('should reject on network errors', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res;
    });

    const rejectSpy = jest.fn((e: AxiosError) => {
      return e;
    });

    jasmine.Ajax.uninstall();

    axios('/foo')
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next);

    function next(reason: AxiosResponse | AxiosError) {
      expect(resolveSpy).not.toHaveBeenCalled();
      expect(rejectSpy).toHaveBeenCalled();
      expect(reason instanceof Error).toBeTruthy();
      expect((reason as AxiosError).message).toBe('Network Error');
      expect(reason.request).toEqual(expect.any(XMLHttpRequest));

      jasmine.Ajax.install();

      done();
    }
  });
});
