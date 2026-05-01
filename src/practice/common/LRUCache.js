class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.previous = null;
  }
}

// Head(Next) <-> A(Next,Prev) <-> B(Next,Prev) <-> C(Next,Prev) <-> Tail(Prev)

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new Node(null, null);
    this.tail = new Node(null, null);

    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _add(node) {
    node.next = this.head.next;
    node.prev = this.head;

    this.head.next.prev = node;
    this.head.next = node;
  }

  _remove(node) {
    node.next.prev = node.prev;
    node.prev.next = node.next;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);

    this._remove(node);
    this._add(node);

    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;

      this._remove(node);
      this._add(node);
    } else {
      this.map.set(key, value);

      const newNode = new Node(key, value);
      this._add(newNode);

      if (this.map.size > this.capacity) {
        const lastNode = this.tail.prev;
        this._remove(lastNode);
        this.map.delete(lastNode.key);
      }
    }
  }
}
