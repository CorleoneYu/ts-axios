// async/await
// function sleep() {
//   console.log('sleep');
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(1)
//     }, (1000));
//   })
// }
// async function asyncTest() {
//   console.log(1);
//   const res1 = await sleep();
//   console.log(2);
//   const res2 = await sleep();
//   console.log(3);
// }
// asyncTest();

function asyncGeneratorStep(
  gen,
  resolve,
  reject,
  _next,
  _throw,
  key,
  arg
) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

// generator
function* gen() {
  console.log(1);
  const foo = yield sleep('foo');
  console.log(2);
  const bar = yield sleep('bar');
  console.log(3);
  return { foo, bar }
}

function sleep(key) {
  console.log('sleep');

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(key);
    }, 1000);
  });
}

const asyncGen = _asyncToGenerator(gen);
asyncGen().then(res => {
  console.log(res);
})
