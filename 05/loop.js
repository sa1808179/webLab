//For Loop

// Used when the number of iterations is known.

for (let i = 1; i <= 5; i++) {
    console.log(`Iteration ${i}`);
}
// Output: Iteration 1, Iteration 2, ..., Iteration 5
 
//While Loop

//Executes as long as a condition is true.

let count = 1;
while (count <= 3) {
    console.log(`Count: ${count}`);
    count++;
}
// Output: Count: 1, Count: 2, Count: 3



//Do-While Loop

//Executes at least once before checking the condition.
let number = 5;
do {
    console.log(`Number is: ${number}`);
    number--;
} while (number > 2);
// Output: Number is: 5, Number is: 4, Number is: 3

//Breaking and Continuing in Loops
//break exits the loop completely.
//continue skips the current iteration and moves to the next one.

for (let i = 1; i <= 5; i++) {
    if (i === 3) {
        continue; // Skips iteration when i = 3
    }
    console.log(i);
}
// Output: 1, 2, 4, 5 (3 is skipped)


console.log("Loop script is running...");
