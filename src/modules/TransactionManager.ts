import { Transaction } from "../types/Transaction";
import { TransactionType } from "../types/Transaction";
// Purpose: Create and Manage transaction records
 export  class  TransactionManager {
          
    //static properties: track how many transactions have been created for (for generating IDs)
    //I made it private as well because there is no need to be accessed by outside 
   //There is one shared counter for the class, rather than one counter per TransactionManager instance.
    private static transactionCounter: number = 0;
    
    

    // Create a new Transaction object with auto-generated Id
    static createTransaction(type:TransactionType, amount:number ,balance:number ,description:string ): Transaction {
   

    const transactionObject:Transaction={
    id: this.generateTransactionId(),
    type,
    amount,
    balance,
    timestamp: new Date(),
    description

    }
    return transactionObject;
    }

    // Create Unique IDs like "TXN000001" , "TXN000002"
     
    // I made it private so that it can be accessed only from inside the TransactionManager class and not be called
    // by the outside 
    private static generateTransactionId():string{
        // Incremeneted the counter when generating new Id so that each time it will be unique
        this.transactionCounter++;
        
        const stringId = this.transactionCounter.toString();
        // padStart says the string should be of length 6 it will put the notfilled spots as 0s
        //Example if stringId="1" it will be "000001"
        const id =stringId.padStart(6,"0");
        const prefix= "TXN";
        //Then added the TXN so the final value is "TXN000001"
        const transactionId= prefix.concat(id);

        return transactionId;

    }
    //Make this class have only static members, you don't need multiple instances of a transaction Manager!
    

}