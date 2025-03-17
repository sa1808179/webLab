

// Print odd numbers between 1 and 100 using while loop
let num = 1;
while (num <= 100) {
    console.log(num);
    num += 2;
}

// Print odd numbers between 1 and 100 using for loop
for (let i = 1; i <= 100; i += 2) {
    console.log(i);
}

const cars = ["Toyota", "Honda", "BMW"];

// Add elements to the array
cars.push("Volvo");
cars.unshift("Mercedes");

function show(array) {
    for (const item of array) {
        console.log(item);
    }
}

// Show cars
show(cars);

// Sort and show cars
cars.sort();
show(cars);

// Array of arrays
const array = [
    [2, 3],
    [34, 89],
    [55, 101, 34],
    [34, 89, 34, 99],
];

const flatten = arr => arr.flat();
const sortd = arr => [...arr].sort((a, b) => b - a);
const max = arr => Math.max(...arr);
const square = arr => arr.map(x => x * x);
const total = arr => arr.reduce((sum, x) => sum + x, 0);
const average = arr => total(arr) / arr.length;
const sumg40 = arr => arr.filter(x => x > 40).reduce((sum, x) => sum + x, 0);
const distinct = arr => [...new Set(arr)];

import promptSync from "prompt-sync";
const prompt = promptSync();

function readStudents() {
    let students = [];
    for (let i = 0; i < 5; i++) {
        let name = prompt("Enter student name: ");
        let gender = prompt("Enter gender: ");
        let age = Math.floor(Math.random() * 19) + 17;
        let grade = Math.floor(Math.random() * 101);
        students.push({ name, gender, age, grade });
    }
    return students;
}

const students = readStudents();

const youngest = students.reduce((a, b) => (a.age < b.age ? a : b));
const oldest = students.reduce((a, b) => (a.age > b.age ? a : b));
const avgAge = average(students.map(s => s.age));
const medianAge = students.map(s => s.age).sort((a, b) => a - b)[Math.floor(students.length / 2)];
const avgGrade = average(students.map(s => s.grade));
const variance = average(students.map(s => (s.grade - avgGrade) ** 2));
const males = students.filter(s => s.gender.toLowerCase() === "male");
const avgMaleGrade = average(males.map(s => s.grade));
students.sort((a, b) => a.name.localeCompare(b.name));
students.sort((a, b) => b.grade - a.grade);
const highestGrade = students.filter(s => s.grade === Math.max(...students.map(s => s.grade)));
const highestFemaleGrade = students.filter(s => s.gender.toLowerCase() === "female").filter(s => s.grade === Math.max(...students.filter(s => s.gender.toLowerCase() === "female").map(s => s.grade)));
const failing = students.some(s => s.grade < 60);
students.forEach(s => s.passing = s.grade >= 60);

const products = [
    { id: 1, name: "Apple iPhone Pro Max", price: 4500 },
    { id: 2, name: "Apple iPad Pro 12.9-inch", price: 5600 },
    { id: 3, name: "Samsung Galaxy Ultra", price: 3900 },
    { id: 4, name: "Microsoft Surface Book", price: 6700 },
    { id: 5, name: "Sony PlayStation Pro", price: 3500 },
    { id: 6, name: "Dell XPS 13", price: 4500 },
    { id: 7, name: "LG 75-inch OLED TV", price: 9800 },
    { id: 8, name: "Bose QuietComfort", price: 1800 },
    { id: 9, name: "Sony Wireless Headphones", price: 1600 },
];

const cart = [];

function addItem(id, quantity) {
    const product = products.find(p => p.id === id);
    if (!product) return console.log("Product not found");
    const cartItem = cart.find(c => c.id === id);
    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
}

function changeQuantity(id, quantity) {
    const cartItem = cart.find(c => c.id === id);
    if (cartItem) {
        cartItem.quantity = quantity;
    } else {
        console.log("Item not found in cart");
    }
}

function deleteItem(id) {
    const index = cart.findIndex(c => c.id === id);
    if (index !== -1) {
        cart.splice(index, 1);
        console.log("Item removed");
    } else {
        console.log("Item not found in cart");
    }
}

function displayInvoice() {
    let total = 0;
    console.log("Invoice:");
    cart.forEach(item => {
        console.log(`${item.name} - ${item.quantity} x ${item.price} = ${item.quantity * item.price}`);
        total += item.quantity * item.price;
    });
    console.log(`Total: ${total}`);
}
