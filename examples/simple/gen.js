function* gen() {
  console.log(1);
  yield "a";
  console.log(2);
  yield "b";
  console.log(3);
}

const g = gen();
console.log(g.next());
console.log(g.next());
console.log(g.next());
