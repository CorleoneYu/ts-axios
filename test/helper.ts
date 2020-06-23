export function getAjaxRequest(): Promise<JasmineAjaxRequest> {
  return new Promise(function(resolve) {
    setTimeout(() => {
      // requests.mostRecent() 模拟的 xhr 对象
      return resolve(jasmine.Ajax.requests.mostRecent());
    }, 0);
  });
}
