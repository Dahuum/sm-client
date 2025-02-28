type int = number;

class User {
  public static count: int = 0;
  public msg: () => string;
  
  constructor(protected readonly username: string, private salary: int, private  Phone: string) {
    User.count++;
    this.msg = function()  {
      return `username: ${this.username}, salary: ${this.salary}, GSM: ${this.Phone}`;
    }
  }
  public print(): void { console.log("The Global user"); }
  get getData() { return `username: ${this.username}, salary: ${this.salary}, GSM: ${this.Phone}`; }
  set setGSM(n: string) { this.Phone = n; }
  returnVal<T>(value: T): T { return value; }
}

class User1 extends User {
  constructor(public age: int,name: string, salary:int, gsm: string) { super(name, salary, gsm); }
  public override print(): void { console.log(`I' m the first user ${this.username}`)}
}

let global = new User("global", 0, "0800100010");
let user = new User1(20, "Abdurrahman", 0, "0699193195");

global.print();
user.print();