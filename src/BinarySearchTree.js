const Queue = require("./Queue");

class BinarySearchTree {
  constructor(key = null, value = null, parent = null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }

  insert(key, value) {
    // If the tree is empty, then this key being inserted is the root node of the tree.
    if (this.key == null) {
        this.key = key;
        this.value = value;
    }

    /* If the tree already exists, then start at the root,
       and compare it to the key that you want to insert.
       If the new key is less than the node's key,
       then the new node needs to live in the left-hand branch. */
    else if (key < this.key) {
        /* If the existing node does not have a left child,
           meaning that the `left` pointer is empty,
           then you can just instantiate and insert the new node
           as the left child of that node, passing `this` as the parent. */
        if (this.left == null) {
            this.left = new BinarySearchTree(key, value, this);
        }
        /* If the node has an existing left child,
           then you recursively call the `insert()` method
           so that the node is added further down the tree. */
        else {
            this.left.insert(key, value);
        }
    }
    /* Similarly, if the new key is greater than the node's key,
       then you do the same thing, but on the right-hand side. */
    else {
        if (this.right == null) {
            this.right = new BinarySearchTree(key, value, this);
        }
        else {
            this.right.insert(key, value);
        }
    }
  }

  find(key) {
    // If the item is found at the root, then return that value.
    if (this.key == key) {
        return this.value;
    }
    /* If the item that you are looking for is less than the root,
       then follow the left child.
       If there is an existing left child,
       then recursively check its left and/or right child
       until you find the item. */
    else if (key < this.key && this.left) {
        return this.left.find(key);
    }
    /* If the item that you are looking for is greater than the root,
       then follow the right child.
       If there is an existing right child,
       then recursively check its left and/or right child
       until you find the item. */
    else if (key > this.key && this.right) {
        return this.right.find(key);
    }
    // You have searched the tree, and the item isn't in the tree.
    else {
        throw new Error('Key Not Found');
    }
  }

  remove(key) {
    if (this.key == key) { //is the node we want to remove
        if (this.left && this.right) {
            const successor = this.right._findMin(); //finds the leftmost node (which will be the min) in the right child
            this.key = successor.key;
            this.value = successor.value;
            successor.remove(successor.key); 
            /*succesor is a bst in itself, that doesnt have a left node since it was
            found at the leftmost part of the subtree, leaving two cases for its removal (has no children, has a right child)*/
        }
        /* If the node only has a left child,
           then you replace the node with its left child. */
        else if (this.left) {
            this._replaceWith(this.left);
        }
        /* And similarly, if the node only has a right child,
           then you replace it with its right child. */
        else if (this.right) {
            this._replaceWith(this.right);
        }
        /* If the node has no children, then
           simply remove it and any references to it
           by calling `this._replaceWith(null)`. */
        else {
            this._replaceWith(null);
        }
    }
    else if (key < this.key && this.left) { 
      /*check if the key we want to remove is smaller than current node, 
      if so recursively call remove on left node*/
        this.left.remove(key);
    }
    else if (key > this.key && this.right) { 
      /*check if the key we want to remove is bigger than current node, 
      if so recursively call remove on right node */
        this.right.remove(key);
    }
    else { //after recursively scan all of the tree, throw error of key not found
        throw new Error('Key Not Found');
    }
  }

  _replaceWith(node) {
    if (this.parent) {
        if (this == this.parent.left) {
            this.parent.left = node;
        }
        else if (this == this.parent.right) {
            this.parent.right = node;
        }

        if (node) {
            node.parent = this.parent;
        }
    }
    else {
        if (node) {
            this.key = node.key;
            this.value = node.value;
            this.left = node.left;
            this.right = node.right;
        }
        else {
            this.key = null;
            this.value = null;
            this.left = null;
            this.right = null;
        }
    }
  }

  _findMin() {
    if (!this.left) {
        return this;
    }
    return this.left._findMin();
  }

  dfsInOrder(values = []){ // first left, then current, then right
    if(this.left){ //visits recursively the left branch
      values = this.left.dfsInOrder(values);
    }

    values.push(this.value); //handles the current node

    if(this.right){ //visits the right branch
      value = this.right.dfsInOrder(values);
    }

    //since left keys are smaller than the right keys, the values array is sorten from smaller to larger values
    return values;
  }

  dfsPreOrder(values=[]) { //first current, then left, then right
    // First, process the current node
    values.push(this.value);

    // Next, process the left node recursively
    if (this.left) {
      values = this.left.dfsPreOrder(values);
    }

    // Finally, process the right node recursively
    if (this.right) {
      values = this.right.dfsPreOrder(values);
    }

    return values;
  }

  dfsPostOrder(values = []) { //first left, then right, current last
    // First, process the left node recursively
    if (this.left) {
      values = this.left.dfsPostOrder(values);
    }

    // Next, process the right node recursively
    if (this.right) {
      values = this.right.dfsPostOrder(values);
    }

    // Finally, process the current node
    values.push(this.value);

    return values;
  }

  bfs(tree, values = []) {
    const queue = new Queue();
    queue.enqueue(tree); // Start the traversal at the tree and add the tree node to the queue to kick off the BFS
    let node = queue.dequeue(); // Remove from the queue
    while (node) {
      values.push(node.value); // Add that value from the queue to an array

      if (node.left) {
        queue.enqueue(node.left); // Add the left child to the queue
      }

      if (node.right) {
        queue.enqueue(node.right); // Add the right child to the queue
      }
      node = queue.dequeue();
    }

    return values;
  }

  getHeight(currentHeight = 0){
    if(!this.left && !this.right) return currentHeight;
    const newHeight = currentHeight + 1;
    if(!this.right) return this.left.getHeight(newHeight);
    if(!this.left) return this.right.getHeight(newHeight);
    const leftHeigth = this.left.getHeight(newHeight);
    const rightHeight = this.right.getHeight(newHeight);

    return Math.max(leftHeigth, rightHeight);
  }

  isBST(){
    const values = this.dfsInOrder();

    for(let i = 1; i < values.length; i++){
      if(values[i] < values[i-1]){
        return false;
      }
    }
    return true;
  }

  findKthLargestValue(k) {
    // Use the existing `dfsInOrder()` method to traverse the tree.
    const values = this.dfsInOrder();
    const kthIndex = values.length - k;

    // Ensure that the index is within the bounds of the array.
    if (kthIndex >= 0) {
      return values[kthIndex];
    } else {
      console.error("k value exceeds the size of the BST.");
    }
  }
}
