
export enum TransactionType{
    DEPOSIT = "DEPOSIT" ,
    WITHDRAWAL = "WITHDRAWAL" ,
    TRANSFER = "TRANSFER" , // Money moving between Accounts
    FEE = "FEE" ,          // Bank Charges
    INTEREST ="INTEREST" // Money Earned

}

export interface Transaction{
    //Each transaction must track
    id: string;
    type: TransactionType;
    amount: number;
    balance : number; //account balance after this transaction
    timestamp: Date;
    description: string;

}

export enum AccountType {
    CHECKING = "Checking",
    SAVINGS = "Savings",
    BUSINESS = "Business"
}
