/*
	Stack

	A stack is a first in/first out collection.

*/

//	Constructs a new stack.
function Stack() {
	this.array = [];
}

//	Pushes an element onto the stack.
Stack.prototype.push = function(element) {
	this.array.push(element);
};

//	Pops an element frm the stack.
Stack.prototype.pop = function() {
	this.array.pop();
};

//	Gets the top element of the stack, or undefined if there 
//	are no elements.
Stack.prototype.top = function() {
	return this.array.length > 0 ? this.array[this.array.length - 1] : undefined;
};

//	Returns true if the stack has any elements, otherwise false.
Stack.prototype.any = function() {
	return this.array.length > 0;
};