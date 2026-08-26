import { AccountType, TransactionType } from "../types/Transaction";
import { BankAccount} from "./BankAccount";
import { TransactionManager } from "./TransactionManager";


// Purpose: Long-term savings with interest but limited withdrawals
export class SavingsAccount extends BankAccount{
   

    private withdrawalsThisMonth:number;
    static readonly MAX_WITHDRAWALS=6;

    constructor(balance:number,accountHolder:string){
        super(balance,accountHolder);
        this.withdrawalsThisMonth=0;
    }
    


     getAccountType(): AccountType {
       return AccountType.SAVINGS;
    }
    getMonthlyFee(): number {
       return 0;
    }
    getInterestRate(): number {
        return 0.02;
    }
     
    //Override

     withdraw(amount: number): string {
         if(this.canWithdraw(amount)){
                    this.balance-=amount;
                    
                    const transaction=TransactionManager.createTransaction(TransactionType.WITHDRAWAL,amount,this.balance,"This is a withdraw transaction");
                    this.transactions.push(transaction);

                    this.withdrawalsThisMonth++;
        
                    return "Success";
                }
        
                else{
                    return "Failure";
                }
    }

    protected canWithdraw(amount: number): boolean {
         return amount > 0 && this.balance >= amount && this.withdrawalsThisMonth < SavingsAccount.MAX_WITHDRAWALS;
    }
   

    //Additional special methods for this class 
    //Here the bank is adding the monthyInterest to the customer account
    // This should be considered as a deposit transaction but I have in transaction Type INTEREST so it should be an INTEREST

     applyMonthlyInterest(): void {

        const monthlyInterest =
            (this.balance * this.getInterestRate()) / 12;

        if (monthlyInterest <= 0) {
            return;
        }

        this.balance += monthlyInterest;

        const transaction = TransactionManager.createTransaction(
            TransactionType.INTEREST,
            monthlyInterest,
            this.balance,
            "Monthly savings interest"
        );

        this.transactions.push(transaction);
    }


    getRemainingWithdrawals():number{
      return SavingsAccount.MAX_WITHDRAWALS - this.withdrawalsThisMonth;

    }

    resetMonthlyWithdrawals(){
        //I have a getAge method can I take advantage of it here? how can I reset everymonth? will see !
      this.withdrawalsThisMonth=0;

    }


}