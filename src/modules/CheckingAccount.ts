import { AccountType } from "../types/Transaction";
import { BankAccount } from "./BankAccount";


//Purpose: : An everyday spending account that allows withdrawals beyond the available balance, up to a defined overdraft limit.
export class CheckingAccount extends BankAccount {

  private overdraftLimit: number=0;

  constructor(
    accountHolder: string, balance: number,overdraftLimit: number = 0 ) {
    super(balance, accountHolder);

    if (overdraftLimit < 0) {
      throw new Error("Overdraft limit cannot be negative");
    }

    this.overdraftLimit = overdraftLimit;
  }

  //overriden method

  protected canWithdraw(amount: number): boolean {
    return amount > 0 && amount <= this.getAvailableBalance();
  }

  getAccountType(): AccountType{
    return AccountType.CHECKING;
  }
  getMonthlyFee(): number {
    return 5;
  }
  getInterestRate(): number {
    return 0; //no interest earned
  }

  //Additiona; methods for the CheckingAccount Class

  setOverdraftLimit(limit: number): string {
    if (limit >= 0) {
      this.overdraftLimit = limit;
      return "Success";
    } else return "The limit should be positive";
  }

  getAvailableBalance(): number {
    return this.balance + this.overdraftLimit;
  }
}
