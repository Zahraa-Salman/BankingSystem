// blueprint for all bank accounts

import { Transaction } from "../types/Transaction";
import { TransactionManager } from "./TransactionManager";
import { TransactionType } from "../types/Transaction";
import { AccountType } from "../types/Transaction";

export  abstract class BankAccount
{
   

    // Static Properties (class-level data shared by all accounts)

     // to store all created accounts with their account number as a key

     // Map<KeyType, ValueType>
     private static accounts: Map<string,BankAccount> = new Map();
     
     // to generate unique account numbers
     private  static accountCounter=0;

    // Instance Properties (Each account has its own)
    
    protected balance:number;
    //Array of all Transaction objects
    protected transactions: Transaction[]=[];

    public readonly accountNumber: string;
    public readonly accountHolder: string;
    public readonly dateCreated: Date = new Date();
   
    // Here the constructor is accepting any number but the balance should be positve I'll check it later
    constructor(balance:number, accountHolder:string){

        if (balance < 0) {
        throw new Error("Initial balance cannot be negative");
    }
        this.balance=balance;
        this.accountHolder=accountHolder;
        this.accountNumber= BankAccount.generateAccountNumber();
      
        // store the account created inside the map
          BankAccount.accounts.set(this.accountNumber, this);
    }
     
    //helper function for generating unique account IDs 

   private static generateAccountNumber(): string {
    this.accountCounter++;

    const stringId = this.accountCounter.toString();
    const id = stringId.padStart(3, "0");

    return "ACC".concat(id);
}

    // Abstract Methods (Subclasses must implement these)

    abstract getAccountType():AccountType;
    abstract getMonthlyFee():number;
    abstract getInterestRate():number;


    // Concrete Methods (SAME for all accounts )

     deposit(amount:number):string{
    
        if(amount >0){
            this.balance+=amount;
            const transaction=TransactionManager.createTransaction(TransactionType.DEPOSIT,amount,this.balance,"This is a deposit transaction");
            this.transactions.push(transaction);

            return "Success";
        }
        else{
            return "Failure";
        }
    }

     withdraw(amount:number):string{
     
        if(this.canWithdraw(amount)){
            this.balance-=amount;

            const transaction=TransactionManager.createTransaction(TransactionType.WITHDRAWAL,amount,this.balance,"This is a withdraw transaction");
            this.transactions.push(transaction);

            return "Success";
        }

        else{
            return "Failure";
        }

    }

   protected canWithdraw(amount:number):boolean{

       return amount > 0 && this.balance >= amount;
    }

    // Required Getters
     
    get currentBalance():number{
       
        return Number(this.balance.toFixed(2));
    }
    
    //return readonly copy of transactions array

    get transactionHistory():readonly Transaction[]{

        return [...this.transactions];

    }
    
    //returns days since account was created 

   get accountAge(): number {
    const currentDate = new Date();

    const differenceInMilliseconds =
        currentDate.getTime() - this.dateCreated.getTime();

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    return Math.floor(
        differenceInMilliseconds / millisecondsPerDay
    );
}

    // Required Static Methods 


    //look for account by account number
    //returns undefined when the key is not found 
    static findAccount(accountNumber:string):BankAccount | undefined{

        return this.accounts.get(accountNumber);

    }

    static getTotalAccounts():number{
     
        return this.accounts.size;
    }
     
    // return sum of all account balances 
    static getTotalDeposits():number{
      let total=0;

      for (const account of this.accounts.values()){
        total+= account.balance;
      }

        return total;
    }
   
    // I'm returning new array of account aobjects .Because it's readonly I can't add or delete account objects 
    // But I can normally apply operations on the object like deposit/withdraw or other operations
    static getAllAccounts(): readonly BankAccount[] {
    return [...this.accounts.values()];
}

}