"use strict";
class User {
    constructor(username, salary, Phone) {
        this.username = username;
        this.salary = salary;
        this.Phone = Phone;
        User.count++;
        this.msg = function () {
            return `username: ${this.username}, salary: ${this.salary}, GSM: ${this.Phone}`;
        };
    }
    print() { console.log("The Global user"); }
    get getData() { return `username: ${this.username}, salary: ${this.salary}, GSM: ${this.Phone}`; }
    set setGSM(n) { this.Phone = n; }
}
User.count = 0;
class User1 extends User {
    constructor(age, name, salary, gsm) {
        super(name, salary, gsm);
        this.age = age;
    }
    print() { console.log(`I' m the first user ${this.username}`); }
}
let global = new User("global", 0, "0800100010");
let user = new User1(20, "Abdurrahman", 0, "0699193195");
global.print();
user.print();
