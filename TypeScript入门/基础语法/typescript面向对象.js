var Stack = /** @class */ (function () {
    function Stack() {
        this.stackarr = [];
    }
    Stack.prototype["in"] = function (value) {
        this.stackarr.unshift(value);
    };
    Stack.prototype.out = function () {
        var head = this.stackarr.shift();
        console.log(head);
        return head;
    };
    Stack.prototype.top = function () {
        console.log(this.stackarr[0]);
        return this.stackarr[0];
    };
    Stack.prototype.size = function () {
        console.log(this.stackarr.length);
        return this.stackarr.length;
    };
    return Stack;
}());
var stack = new Stack();
stack["in"]('x');
stack["in"]('y');
stack["in"]('z');
stack.top(); // 输出 'z' 
stack.size(); // 输出 3 
stack.out(); // 输出 'z' 
stack.top(); // 输出 'y' 
stack.size(); // 输出 2 
