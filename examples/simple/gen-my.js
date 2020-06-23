function myGen() {
  let state = 0; // 状态
  let done = false;

  function stop() {
    done = true;
  }

  function run() {
    while (true) {
      switch (state) {
        case 0:
          console.log(1);
          state = 1;
          return 'a';
        case 1:
          console.log(2);
          state = 2;
          return 'b';
        case 2:
          console.log(3);
          state = 3;
          break;
        case 3:
          return stop();
      }
    }
  }

  return {
    next() {
      if (done) {
        return {
          val: undefined,
          done: true
        }
      }

      const val = run();
      return {
        done,
        val
      }
    }
  }
}

const g = myGen();
console.log(g.next());
console.log(g.next());
console.log(g.next());
