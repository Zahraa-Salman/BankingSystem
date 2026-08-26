import { Transaction } from "./types/Transaction";
import { TransactionManager } from "./modules/TransactionManager";
import { BankAccount } from "./modules/BankAccount";
import { Bank } from "./modules/BankManagement";
import { CheckingAccount } from "./modules/CheckingAccount";
import { BusinessAccount } from "./modules/BussinessAccount";
import { SavingsAccount } from "./modules/SavingsAccount";

// index.ts - Complete test driver for your banking system
// Run with: npx tsx src/banking-test.ts


console.log("🏦 Banking System Test Driver");
console.log("=" .repeat(50));

try {
  // Test 1: Bank Creation
  console.log("\n📋 TEST 1: Bank Creation");
  const bank1 = new Bank("First National Bank");
  console.log(`✓ Bank name: ${bank1.name}`);
  
  // Test 2: Account Creation
  console.log("\n📋 TEST 2: Account Creation");
  
  const checking = bank1.createCheckingAccount("Alice Johnson", 1000, 500);
  console.log(`✓ Checking Account: ${checking.accountNumber} - ${checking.accountHolder}`);
  console.log(`✓ Account Type: ${checking.getAccountType()}`);
  console.log(`✓ Initial Balance: $${checking.currentBalance}`);
  console.log(`✓ Available Balance: $${checking.getAvailableBalance()}`);
  
  const savings = bank1.createSavingsAccount("Bob Smith", 5000);
  console.log(`✓ Savings Account: ${savings.accountNumber} - ${savings.accountHolder}`);
  console.log(`✓ Account Type: ${savings.getAccountType()}`);
  console.log(`✓ Initial Balance: $${savings.currentBalance}`);
  
  const business = bank1.createBusinessAccount("Charlie Brown", "Charlie's Shop", 10000);
  console.log(`✓ Business Account: ${business.accountNumber} - ${business.getBusinessName()}`);
  console.log(`✓ Account Type: ${business.getAccountType()}`);
  console.log(`✓ Initial Balance: $${business.currentBalance}`);
   
  
  // Test 3: Basic Transactions
  console.log("\n📋 TEST 3: Basic Deposits and Withdrawals");
  
  console.log(`\nChecking Account Operations:`);
  console.log(`Balance before: $${checking.currentBalance}`);
  
  const deposit1 = checking.deposit(500);
  console.log(`✓ Deposit $500: ${deposit1 ? "SUCCESS" : "FAILED"}`);
  console.log(`Balance after deposit: $${checking.currentBalance}`);
  
  const withdraw1 = checking.withdraw(2000); // Should work with overdraft
  console.log(`✓ Withdraw $2000: ${withdraw1 ? "SUCCESS" : "FAILED"}`);
  console.log(`Balance after withdrawal: $${checking.currentBalance}`);
  console.log(`Available balance: $${checking.getAvailableBalance()}`);
  
  //I did this additional check I'm just do my own testing
  const withdraw2 = checking.withdraw(500);
  console.log(
    `✓ Withdraw $500: ${withdraw2 === "Success" ? "SUCCESS" : "FAILED"}`
);
  console.log(`Balance after withdrawal: $${checking.currentBalance}`);
  console.log(`Available balance: $${checking.getAvailableBalance()}`);

  
  // Test 4: Savings Account Withdrawal Limits
  console.log("\n📋 TEST 4: Savings Account Withdrawal Limits");
  console.log(`Savings balance: $${savings.currentBalance}`);
  console.log(`Remaining withdrawals: ${savings.getRemainingWithdrawals()}/6`);
  
  // Make 6 withdrawals (should succeed)
  for (let i = 1; i <= 6; i++) {
    const result = savings.withdraw(100);
    console.log(`✓ Withdrawal ${i}: ${result==="Success" ? "SUCCESS" : "FAILED"} - Remaining: ${savings.getRemainingWithdrawals()}`);
  }
  
  // 7th withdrawal should fail
  const failedWithdraw = savings.withdraw(100);
  console.log(`✓ 7th withdrawal: ${failedWithdraw=== "Success" ? "SUCCESS" : "FAILED (EXPECTED)"}`);
  
 
  // Test 5: Interest Calculation
  console.log("\n📋 TEST 5: Interest Calculation");
  console.log(`Savings balance before interest: $${savings.currentBalance}`);
  savings.applyMonthlyInterest();
  console.log(`Savings balance after interest: $${savings.currentBalance}`);
  console.log(`Interest rate: ${savings.getInterestRate() * 100}% annually`);

  // Reset for more testing
  savings.resetMonthlyWithdrawals();
  console.log(`✓ Withdrawals reset. Remaining: ${savings.getRemainingWithdrawals()}`);

 

  // Test 6: Business Account Transaction Fees
  console.log("\n📋 TEST 6: Business Account Transaction Fees");
  console.log(`Business balance before: $${business.currentBalance}`);
  
  business.deposit(1000);
  console.log(`Business balance after $1000 deposit: $${business.currentBalance}`);
  console.log(`Monthly fee: $${business.getMonthlyFee()}`);

  
  // Test 7: Transfers
  console.log("\n📋 TEST 7: Account Transfers");
  console.log(`Before transfer:`);
  console.log(`  Savings: $${savings.currentBalance}`);
  console.log(`  Checking: $${checking.currentBalance}`);
  
  const transfer1 = bank1.transfer(savings.accountNumber, checking.accountNumber, 1000);
  console.log(`✓ Transfer $1000 from Savings to Checking: ${transfer1==="Success" ? "SUCCESS" : "FAILED"}`);
  
  console.log(`After transfer:`);
  console.log(`  Savings: $${savings.currentBalance}`);
  console.log(`  Checking: $${checking.currentBalance}`);
  
  // Test 8: Static Account Management
  console.log("\n📋 TEST 8: Static Account Management");
  console.log(`✓ Total Accounts Created: ${BankAccount.getTotalAccounts()}`);
  console.log(`✓ Total Money in System: $${BankAccount.getTotalDeposits().toFixed(2)}`);
  
  const foundAccount = BankAccount.findAccount(checking.accountNumber);
  console.log(`✓ Found account ${checking.accountNumber}: ${foundAccount ? "YES" : "NO"}`);
  
  // Test 9: Transaction History
  console.log("\n📋 TEST 9: Transaction History");
  const checkingHistory = checking.transactionHistory;
  console.log(`✓ Checking account has ${checkingHistory.length} transactions:`);
  
  checkingHistory.slice(-3).forEach(transaction => {
    console.log(`  ${transaction.type}: $${transaction.amount} - ${transaction.description}`);
  });

  /*
  // Test 10: Account Freezing
  console.log("\n📋 TEST 10: Account Freezing");
  console.log(`Account frozen: ${checking.isFrozen()}`);
  
  checking.freeze();
  console.log(`Account frozen after freeze(): ${checking.isFrozen()}`);
  
  const frozenDeposit = checking.deposit(100);
  console.log(`✓ Deposit while frozen: ${frozenDeposit ? "SUCCESS" : "FAILED (EXPECTED)"}`);
  
  checking.unfreeze();
  const unfrozenDeposit = checking.deposit(100);
  console.log(`✓ Deposit after unfreeze: ${unfrozenDeposit ? "SUCCESS" : "FAILED"}`);

  // Test 11: Daily Withdrawal Limits
  console.log("\n📋 TEST 11: Daily Withdrawal Limits");
  console.log(`Testing daily withdrawal limits...`);
  
  // This test depends on your daily limit implementation
  console.log(`✓ Daily limits enforced (implement in your code)`);

  // Test 12: Bank Reports
  console.log("\n📋 TEST 12: Bank Reports");
  
  const totalBalance = bank1.getTotalBalance();
  console.log(`✓ Bank total balance: $${totalBalance.toFixed(2)}`);
  
  const aliceAccounts = bank1.getAccountsByHolder("Alice Johnson");
  console.log(`✓ Alice's accounts: ${aliceAccounts.length}`);
  
  const checkingAccounts = bank1.getAccountsByType("Checking");
  console.log(`✓ Checking accounts: ${checkingAccounts.length}`);
  
  const statement = bank1.generateMonthlyStatement(checking.accountNumber);
  console.log(`✓ Monthly statement generated (length: ${statement.length} chars)`);

  // Test 13: Account Age
  console.log("\n📋 TEST 13: Account Age");
  console.log(`✓ Checking account age: ${checking.accountAge} days`);
  console.log(`✓ Savings account age: ${savings.accountAge} days`);

  // Test 14: Edge Cases
  console.log("\n📋 TEST 14: Edge Cases");
  
  // Try to withdraw negative amount
  const negativeWithdraw = checking.withdraw(-100);
  console.log(`✓ Negative withdrawal: ${negativeWithdraw ? "SUCCESS" : "FAILED (EXPECTED)"}`);
  
  // Try to deposit negative amount
  const negativeDeposit = checking.deposit(-100);
  console.log(`✓ Negative deposit: ${negativeDeposit ? "SUCCESS" : "FAILED (EXPECTED)"}`);
  
  // Try to transfer to non-existent account
  const badTransfer = bank1.transfer(checking.accountNumber, "FAKE123", 100);
  console.log(`✓ Transfer to fake account: ${badTransfer ? "SUCCESS" : "FAILED (EXPECTED)"}`);

  console.log("\n🎉 ALL TESTS COMPLETED!");
  console.log("=" .repeat(50));
  
  // Final Summary
  console.log("\n📊 FINAL SYSTEM STATE:");
  console.log(`Total Accounts: ${BankAccount.getTotalAccounts()}`);
  console.log(`Total Money: $${BankAccount.getTotalDeposits().toFixed(2)}`);
  console.log(`Bank Name: ${bank1.name}`);
  */

} catch (error) {
    console.error("❌ TEST FAILED WITH ERROR:");

    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error(error);
    }

    console.error("\n💡 This means your implementation has a bug to fix!");
}

