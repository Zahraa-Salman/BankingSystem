import { AccountType, TransactionType } from "../types/Transaction";
import { BankAccount } from "./BankAccount";
import { TransactionManager } from "./TransactionManager";


//Purpose: Commercial account with higher fees but bussiness features
export class BusinessAccount extends BankAccount{
   
    private businessNameValue:string;
    private transactionFee:number =0.10;

    constructor(balance:number,accountHolder:string,businessName:string){
        super(balance,accountHolder);
        this.businessNameValue=businessName;
    }

    getAccountType(): AccountType {
        return AccountType.BUSINESS;
    }
    getMonthlyFee(): number {
        return 25;
    }
    getInterestRate(): number {
        return 0.01;
    }

    //helper function

    private applyTransactionFee():void{
      this.balance -= this.transactionFee;

        const feeTransaction = TransactionManager.createTransaction(
            TransactionType.FEE,
            this.transactionFee,
            this.balance,
            "Transaction fee"
        );

        this.transactions.push(feeTransaction);
    }
    
    //Override
    // Apply transaction fee after Successful deposit or withdraw
     
    deposit(amount: number): string {
    const result = super.deposit(amount);

    if (result === "Success") {
        this.applyTransactionFee();
    }

    return result;
}
  
   withdraw(amount: number): string {
    const result = super.withdraw(amount);

    if (result === "Success") {
       this.applyTransactionFee();
    }

    return result;
}
    //Additional Methods:

    getBusinessName():string{
        return this.businessNameValue;
    }
    
    //handles both debits and credits with fees
   processTransaction(amount: number, type: TransactionType): string {
    if (type === TransactionType.DEPOSIT) {
        return this.deposit(amount);
    }

    if (type === TransactionType.WITHDRAWAL) {
        return this.withdraw(amount);
    }

    return "Failure";
}

}
