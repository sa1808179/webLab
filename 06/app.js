// app.js - Testing the Bank Module

import * as Bank from './bank.js';

console.log("Initial Accounts:", Bank.getAll());

// Add new accounts
const savingsId1 = Bank.add({ balance: 5000, type: "Savings" });
const savingsId2 = Bank.add({ balance: 12000, type: "Savings" });
const currentId1 = Bank.add({ balance: 8000, type: "Current" });
const currentId2 = Bank.add({ balance: 15000, type: "Current" });

console.log("Accounts after adding new ones:", Bank.getAll());

// Perform Deposits and Withdrawals
Bank.deposit(savingsId1, 2000);
Bank.withdraw(currentId1, 1000);

console.log("Accounts after transactions:", Bank.getAll());

// Charge Monthly Fee
Bank.deductFee(10);
console.log("Total Balance After Monthly Fee Deduction:", Bank.totalBalance());

// Distribute 6% Benefit to Savings Accounts
Bank.distributeBenefit(6);
console.log("Total Balance After Distributing Benefit:", Bank.totalBalance());

// Display Accounts in JSON Format
console.log("Accounts JSON:", Bank.toJSON());
