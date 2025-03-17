// JavaScript has three ways to declare variables:

// var (function-scoped, avoid using it in modern JS)
 //let (block-scoped, recommended for mutable values)
//const (block-scoped, used for constants)


var a = 5;       // Function-scoped variable
let b = 10;      // Block-scoped variable
const c = 20;    // Constant, cannot be reassigned

console.log(a);  // Output: 5
console.log(b);  // Output: 10
console.log(c);  // Output: 20

// Using template literals (correcting your example)
console.log(`Value of x: ${b}`);  // Output: Value of x: 10
