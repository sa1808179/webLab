// bank.js - Bank Module

// Importing nanoid for generating unique account IDs
import { nanoid } from 'nanoid';

// Array to store account details
const accounts = [
    { id: "08a45dd424", balance: 502.30, type: "Savings" },
    { id: "a9e2465841", balance: 4100.00, type: "Current" },
    { id: "7160dca601", balance: 34420.55, type: "Current" },
    { id: "2efde49d9d", balance: 61023.69, type: "Savings" }
];

// Function to add a new account
export function add(account) {
    const newAccount = { id: nanoid(), ...account };
    accounts.push(newAccount);
    return newAccount.id;
}

// Function to get all accounts
export function getAll() {
    return accounts;
}

// Function to get an account by its ID
export function get(id) {
    return accounts.find(acc => acc.id === id);
}

// Function to remove an account by ID
export function remove(id) {
    const index = accounts.findIndex(acc => acc.id === id);
    if (index !== -1) accounts.splice(index, 1);
}

// Function to deposit a specified amount into an account
export function deposit(id, amount) {
    const account = get(id);
    if (account) account.balance += amount;
}

// Function to withdraw a specified amount from an account (if sufficient balance exists)
export function withdraw(id, amount) {
    const account = get(id);
    if (account && account.balance >= amount) {
        account.balance -= amount;
    } else {
        console.log("Insufficient funds or account not found.");
    }
}

// Function to calculate the total balance of all accounts
export function totalBalance() {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
}

// Function to deduct a monthly fee from all Current accounts
export function deductFee(fee) {
    accounts.forEach(acc => {
        if (acc.type === "Current") acc.balance -= fee;
    });
}

// Function to distribute a percentage benefit to all Savings accounts
export function distributeBenefit(percentage) {
    accounts.forEach(acc => {
        if (acc.type === "Savings") acc.balance += acc.balance * (percentage / 100);
    });
}

// Function to convert accounts data into JSON format
export function toJSON() {
    return JSON.stringify(accounts, null, 2);
}

// Function to parse JSON string back into an array of accounts
export function fromJSON(json) {
    return JSON.parse(json);
}
