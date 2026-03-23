# Assignment_5_PH
1️⃣ What is the difference between 'var', 'let', and 'const'?

'var', 'let', and 'const' are all used to declare variables in JavaScript, but they behave differently.

var:
'var' is the old way of declaring variables. It is function scoped, not block scoped. It can be re-declared and updated. It can sometimes cause unexpected bugs because of its scope behavior.

let:
'let' is the modern way to declare variables that may change later. It is block scoped (works inside `{}` blocks properly). It can be updated, but cannot be re-declared in the same scope.

const:
'const' is used for variables that should not be reassigned. It is also block scoped. It cannot be updated or re-declared. However, if it stores an array or object, the contents inside it can still be changed.

Example:
var a = 10;
let b = 20;
const c = 30;


2️⃣ What is the spread operator ('...')?

The spread operator ('...') is used to expand or copy elements of an array or properties of an object. It makes code shorter and cleaner.

Example:
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4, 5];

Result:
[1, 2, 3, 4, 5]
Example with object:
const user = { name: "Rounak" };
const updatedUser = { ...user, role: "admin" };

3️⃣ What is the difference between 'map()', 'filter()', and 'forEach()'?

These three are array methods, but they are used for different purposes.

map(): 'map()' creates a new array. It transforms each item in the original array

Example:
const nums = [1, 2, 3];
const doubled = nums.map(num => num * 2);

Result:
[2, 4, 6]

filter():
'filter()' creates a new array. It keeps only the items that match a condition.

Example:
const nums = [1, 2, 3, 4];
const even = nums.filter(num => num % 2 === 0);
Result:
[2, 4]

forEach():
'forEach()' loops through the array. It is mainly used to perform an action. It does not return a new array.

Example:
const nums = [1, 2, 3];
nums.forEach(num => console.log(num));


4️⃣ What is an arrow function?

An arrow function is a shorter and cleaner way to write a function in JavaScript. It uses the '=>' symbol.

Example:
const greet = (name) => {
  return `Hello, ${name}`;
};

5️⃣ What are template literals?

'Template literals' are a modern way to write strings in JavaScript using backticks ("''" ) instead of quotes. They make it easy to insert variables inside a string using `${}`.

Example:
const name = "Rounak";
const message = `Hello, ${name}!`;

Result:
Hello, Rounak!
