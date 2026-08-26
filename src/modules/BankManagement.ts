//

import { CheckingAccount } from "./CheckingAccount";
import { SavingsAccount } from "./SavingsAccount";
import { BusinessAccount } from "./BussinessAccount";
import { BankAccount } from "./BankAccount";
import { AccountType, TransactionType } from "../types/Transaction";

export class Bank {
  private bankName: string;

  constructor(bankName: string) {
    this.bankName = bankName;
  }

  get name(): string {
    return this.bankName;
}

  createCheckingAccount(
    accountHolder: string,
    initialDeposit: number,
    overDraftLimit?: number,
  ): CheckingAccount {
    const checkingAccount = new CheckingAccount(
      accountHolder,
      initialDeposit,
      overDraftLimit,
    );
    return checkingAccount;
  }

  createSavingsAccount(
    accountHolder: string,
    initialDeposit: number,
  ): SavingsAccount {
    const savingAccount = new SavingsAccount(initialDeposit, accountHolder);
    return savingAccount;
  }

  createBusinessAccount(
    accountHolder: string,
    businessName: string,
    initialDeposit: number,
  ): BusinessAccount {
    const businessAccount = new BusinessAccount(
      initialDeposit,
      accountHolder,
      businessName,
    );
    return businessAccount;
  }

  transfer(
    fromAccountNumber: string,
    toAccountNumber: string,
    amount: number,
  ): string {
    //Find both accounts
    const fromAccount = BankAccount.findAccount(fromAccountNumber);
    const toAccount = BankAccount.findAccount(toAccountNumber);

    // Both accounts must exist
    if (!fromAccount || !toAccount) {
      return "Failure";
    }

    // Prevent meaningless transfers
    if (amount <= 0) {
      return "Failure";
    }

    // Optional but sensible:
    // don't transfer to the exact same account
    if (fromAccountNumber === toAccountNumber) {
      return "Failure";
    }

    //Withdraw from source account
    const withdrawRes = fromAccount.withdraw(amount);

    if (withdrawRes === "Failure") {
      return "Failure";
    }
    // if successful,deposit to destination account

    const depositRes = toAccount.deposit(amount);

    if (depositRes === "Failure") {
      // DO NOT use:
      // fromAccount.deposit(amount)
      // You need a rollback mechanism that restores the
      // original balance without creating another normal transaction.

      return "Failure";
    }

    return "Success";
  }

  //sum of all account balances
  getTotalBalance(): number {
    let total = 0;
    const accounts = BankAccount.getAllAccounts();
    for (const account of accounts) {
      total += account.currentBalance;
    }
    return total;
  }

  //Return array of accounts for a person

  getAccountsByHolder(holderName: string): BankAccount[] {
    const accounts = BankAccount.getAllAccounts();

    const holderAccounts = accounts.filter(
      (account) => account.accountHolder === holderName,
    );

    return holderAccounts;
  }

  // return array of accounts of specific type

  getAccountsByType(accountType: AccountType): BankAccount[] {
    const accounts = BankAccount.getAllAccounts();

    const accountsOfType = accounts.filter(
      (account) => account.getAccountType() === accountType,
    );

    return accountsOfType;
  }

  //returns formatted string with account summary
  generateMonthlyStatement(accountNumber: string): string {
    const account = BankAccount.findAccount(accountNumber);

    if (!account) {
      return "Account not found";
    }

    let statement = `
Monthly Statement
-------------------------
Account Number: ${account.accountNumber}
Account Holder: ${account.accountHolder}
Account Type: ${account.getAccountType()}
Current Balance: $${account.currentBalance.toFixed(2)}
Account Age: ${account.accountAge} days

Transactions:
`;

    for (const transaction of account.transactionHistory) {
      statement += `
${transaction.timestamp.toLocaleDateString()} | ${transaction.type} | $${transaction.amount.toFixed(2)} | Balance: $${transaction.balance.toFixed(2)} | ${transaction.description}`;
    }

    return statement;
  }
}
