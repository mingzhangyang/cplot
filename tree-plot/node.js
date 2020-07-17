/**********************************************************************************************
 * Node Class
 **********************************************************************************************/

class Node {
  constructor(obj={}) {
    this.name = typeof obj.name === 'undefined' ? '' : obj.name;
    this.childNodes = [];
    this.parentNode = null;
  }


  static _isSubChild(parent, child) {
    let res = false;
    let p = child.parentNode;
    while (p) {
      if (p === parent) {
        res = true;
      }
      p = p.parentNode;
    }
    return res;
  }

  removeChildNode(node) {
    if (node.constructor !== Node) {
      throw new TypeError('invalid type to remove');
    }
    if (!this.childNodes.includes(node)) {
      throw new Error('not a child node');
    }

    node.parentNode = null;
    this.childNodes.splice(this.childNodes.indexOf(node), 1);
    return node;
  }

  addChildNode(node) {
    if (node.constructor !== Node) {
      throw new TypeError('invalid type to add');
    }
    if (this.childNodes.includes(node)) {
      throw new Error('already a child node');
    }
    if (Node._isSubChild(node, this)) {
      throw new Error('can not add ancestry node as child node')
    }
    if (node.parentNode) {
      node.parentNode.removeChildNode(node);
    }

    this.childNodes.push(node);
    node.parentNode = this;
  }

  // counts of itself plus all nodes under it, including sub-child
  weight() {
    let n = 1;
    for (let node of this.childNodes) {
      n += node.weight();
    }
    return n;
  }

  maxDepth() {
    let n = 0;
    for (let node of this.childNodes) {
      let m = node.maxDepth();
      if (n < m) {
        n = m;
      }
    }
    return n + 1;
  }
}

let n0 = new Node({name: '0'});
let n1 = new Node({name: '1'});
let n2 = new Node({name: '2'});
let n3 = new Node({name: '3'});
let n4 = new Node({name: '4'});
let n5 = new Node({name: '5'});

n0.addChildNode(n1);
n0.addChildNode(n2);
n1.addChildNode(n3);
n1.addChildNode(n4);
n2.addChildNode(n5);

console.log(n0, n0.weight(), n0.maxDepth());

n1.addChildNode(n2);
console.log(n0, n0.weight(), n0.maxDepth());

n2.addChildNode(n1);