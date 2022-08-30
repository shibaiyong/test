class Stack {

  stackarr:string[]

  constructor() { 

    this.stackarr = []
  } 
  in(value) { 
    this.stackarr.unshift(value)
  }
  out() {
    const head = this.stackarr.shift()
    console.log(head)
    return head

  }
  top() {
    console.log(this.stackarr[0])

    return this.stackarr[0]

  }
  size() {

    console.log(this.stackarr.length)

    return this.stackarr.length

  } 
}
  const stack = new Stack()
  stack.in('x') 
  stack.in('y') 
  stack.in('z') 
  stack.top() // 输出 'z' 
  stack.size() // 输出 3 
  stack.out() // 输出 'z' 
  stack.top() // 输出 'y' 
  stack.size() // 输出 2 
