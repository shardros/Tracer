const top = 0;
const parent = i => ((i + 1) >>> 1) - 1; //
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

this._heap = [];
this._comparator = (a, b) => (a < b);

PriorityQueue = class {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[top];
  }
  enqueue(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  dequeue() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > top) {
      this._swap(top, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[top] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > top && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = top;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

module.exports = PriorityQueue;

/**
// Default comparison semantics
const queue = new PriorityQueue();
queue.push(10, 20, 30, 40, 50);
console.log('Top:', queue.peek()); //=> 50
console.log('Size:', queue.size()); //=> 5
console.log('Contents:');
console.time('e');
while (!queue.isEmpty()) {
  console.log(queue.pop()); //=> 40, 30, 20, 10
}

// Pairwise comparison semantics
const pairwiseQueue = new PriorityQueue((a, b) => a[1] > b[1]);
pairwiseQueue.push(['low', 0], ['medium', 5], ['high', 10]);
console.log('\nContents:');
while (!pairwiseQueue.isEmpty()) {
  console.log(pairwiseQueue.pop()[0]); //=> 'high', 'medium', 'low'
}

function x (i) {return ((i + 1) >>> 1) - 1}

console.log(left(2))

*/