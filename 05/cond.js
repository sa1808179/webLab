//JavaScript supports conditional statements like if, else if, else, and switch.

let age = 18;

if (age < 18) {
    console.log("You are a minor.");
} else if (age === 18) {
    console.log("You just became an adult!");
} else {
    console.log("You are an adult.");
}

// Using the ternary operator (shorter way)
let canVote = age >= 18 ? "Yes, you can vote." : "No, you cannot vote.";
console.log(canVote);  // Output: Yes, you can vote.

// Switch Case Example
let day = "Monday";

switch (day) {
    case "Monday":
        console.log("Start of the week!");
        break;
    case "Friday":
        console.log("Weekend is coming!");
        break;
    case "Sunday":
        console.log("Rest day!");
        break;
    default:
        console.log("A regular day.");
}

