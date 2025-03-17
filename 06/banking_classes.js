// banking_classes.js - Refactored Bank System Using Classes with Unit Testing

import { nanoid } from 'nanoid';

// BankAccount class represents a general bank account
class BankAccount {
    #id;
    #balance;
    
    constructor(account) {
        this.#id = this.#generateId();
        this.#balance = account.balance || 0;
    }
    
    // Get account ID
    get id() {
        return this.#id;
    }
    
    // Get account balance
    get balance() {
        return this.#balance;
    }
    
    // Deposit money into the account
    deposit(amount) {
        if (amount > 0) {
            this.#balance += amount;
        } else {
            throw new Error("Deposit amount must be greater than zero.");
        }
    }
    
    // Withdraw money from the account
    withdraw(amount) {
        if (amount > 0 && amount <= this.#balance) {
            this.#balance -= amount;
        } else {
            throw new Error("Insufficient funds or invalid amount.");
        }
    }
    
    // Convert account details to a string format
    toString() {
        return `Account ID: ${this.#id}, Balance: ${this.#balance}`;
    }
    
    // Convert account details to JSON format
    toJSON() {
        return JSON.stringify({ id: this.#id, balance: this.#balance });
    }
    
    // Private method to generate a unique account ID
    #generateId() {
        return nanoid();
    }
}

// CurrentAccount class extends BankAccount with an additional fee property
class CurrentAccount extends BankAccount {
    #fee;
    
    constructor(account) {
        super(account);
        this.#fee = account.fee || 10; // Default fee is 10
    }
    
    // Charge a fee from the account
    charge() {
        this.withdraw(this.#fee);
    }
    
    // Get fee value
    get fee() {
        return this.#fee;
    }
    
    // Set a new fee value
    set fee(amount) {
        if (amount > 0) {
            this.#fee = amount;
        } else {
            throw new Error("Fee must be greater than zero.");
        }
    }
    
    // Convert account details to string
    toString() {
        return `${super.toString()}, Fee: ${this.#fee}`;
    }
    
    // Convert account details to JSON format
    toJSON() {
        return JSON.stringify({ ...JSON.parse(super.toJSON()), fee: this.#fee });
    }
}

// SavingsAccount class extends BankAccount with a benefit percentage property
class SavingsAccount extends BankAccount {
    #benefit;
    
    constructor(account) {
        super(account);
        this.#benefit = account.benefit || 6; // Default benefit is 6%
    }
    
    // Apply benefit to account balance
    distribute() {
        this.deposit(this.balance * (this.#benefit / 100));
    }
    
    // Get benefit percentage
    get benefit() {
        return this.#benefit;
    }
    
    // Set a new benefit percentage
    set benefit(amount) {
        if (amount > 0) {
            this.#benefit = amount;
        } else {
            throw new Error("Benefit must be greater than zero.");
        }
    }
    
    // Convert account details to string
    toString() {
        return `${super.toString()}, Benefit: ${this.#benefit}%`;
    }
    
    // Convert account details to JSON format
    toJSON() {
        return JSON.stringify({ ...JSON.parse(super.toJSON()), benefit: this.#benefit });
    }
}

// Bank class manages multiple bank accounts
class Bank {
    #accounts;
    
    constructor() {
        this.#accounts = [];
    }
    
    // Get all accounts
    get accounts() {
        return this.#accounts;
    }
    
    // Add an account to the bank
    add(account) {
        let newAccount;
        if (account.type === "Current") {
            newAccount = new CurrentAccount(account);
        } else if (account.type === "Savings") {
            newAccount = new SavingsAccount(account);
        } else {
            throw new Error("Invalid account type.");
        }
        this.#accounts.push(newAccount);
        return newAccount.id;
    }
    
    // Retrieve an account by ID
    get(id) {
        return this.#accounts.find(acc => acc.id === id);
    }
    
    // Remove an account by ID
    remove(id) {
        this.#accounts = this.#accounts.filter(acc => acc.id !== id);
    }
    
    // Get total balance of all accounts
    totalBalance() {
        return this.#accounts.reduce((sum, acc) => sum + acc.balance, 0);
    }
    
    // Convert all accounts to a string format
    toString() {
        return this.#accounts.map(acc => acc.toString()).join("\n");
    }
    
    // Convert all accounts to JSON format
    toJSON() {
        return JSON.stringify(this.#accounts.map(acc => JSON.parse(acc.toJSON())), null, 2);
    }
}

// Exporting the Bank class for external usage
export { Bank, BankAccount, CurrentAccount, SavingsAccount };

// Unit Testing for the Bank Class
import { expect } from "chai";
import { describe, it } from "mocha";

describe("Bank System", function () {
    let bank;

    beforeEach(() => {
        bank = new Bank();
    });

    it("should add a new savings account", function () {
        const id = bank.add({ balance: 5000, type: "Savings" });
        expect(bank.get(id)).to.not.be.undefined;
    });

    it("should add a new current account", function () {
        const id = bank.add({ balance: 3000, type: "Current" });
        expect(bank.get(id)).to.not.be.undefined;
    });

    it("should deposit money into an account", function () {
        const id = bank.add({ balance: 1000, type: "Savings" });
        bank.get(id).deposit(500);
        expect(bank.get(id).balance).to.equal(1500);
    });

    it("should withdraw money from an account", function () {
        const id = bank.add({ balance: 1000, type: "Current" });
        bank.get(id).withdraw(500);
        expect(bank.get(id).balance).to.equal(500);
    });

    it("should calculate the total balance", function () {
        bank.add({ balance: 2000, type: "Savings" });
        bank.add({ balance: 3000, type: "Current" });
        expect(bank.totalBalance()).to.equal(5000);
    });
});
