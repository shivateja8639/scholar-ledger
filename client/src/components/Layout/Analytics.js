import React from 'react';
import { Progress } from 'antd';

const Analytics = ({ allTransaction }) => {
  const categories = [
    "salary", "tip", "project", "food", "movie",
    "bills", "medical", "fee", "tax"
  ];

  // Transaction counts
  const totalTransaction = allTransaction.length;
  const totalIncomeTransactions = allTransaction.filter(tx => tx.type === 'income');
  const totalExpenseTransactions = allTransaction.filter(tx => tx.type === 'expense');
  const totalIncomePercent = (totalIncomeTransactions.length / totalTransaction) * 100;
  const totalExpensePercent = (totalExpenseTransactions.length / totalTransaction) * 100;

  // Turnover calculations
  const totalTurnover = allTransaction.reduce((acc, tx) => acc + tx.amount, 0);
  const totalIncomeTurnover = totalIncomeTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  const totalExpenseTurnover = totalExpenseTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  const totalIncomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100;
  const totalExpenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100;

  return (
    <>
      {/* Summary Section */}
      <div className="row m-3 d-flex justify-content-between gap-3 flex-wrap analytics-summary">
        <div className="col-md-5 analytics-card card">
          <div className="card-header">
            Total Transactions: {totalTransaction}
          </div>
          <div className="card-body">
            <h5 className="text-success">Income: {totalIncomeTransactions.length}</h5>
            <h5 className="text-danger">Expense: {totalExpenseTransactions.length}</h5>
            <Progress type="circle" strokeColor="green" className="mx-2" percent={totalIncomePercent.toFixed(0)} />
            <Progress type="circle" strokeColor="red" className="mx-2" percent={totalExpensePercent.toFixed(0)} />
          </div>
        </div>

        <div className="col-md-5 analytics-card card">
          <div className="card-header">
            Total Turnover: ₹{totalTurnover}
          </div>
          <div className="card-body">
            <h5 className="text-success">Income: ₹{totalIncomeTurnover}</h5>
            <h5 className="text-danger">Expense: ₹{totalExpenseTurnover}</h5>
            <Progress type="circle" strokeColor="green" className="mx-2" percent={totalIncomeTurnoverPercent.toFixed(0)} />
            <Progress type="circle" strokeColor="red" className="mx-2" percent={totalExpenseTurnoverPercent.toFixed(0)} />
          </div>
        </div>
      </div>

      {/* Category-wise Analysis */}
      <div className="row mt-3 d-flex justify-content-between gap-3 flex-wrap">
        <div className="col-md-5 analytics-category">
          <h4 className="mb-3">Category-wise Income</h4>
          {categories.map(category => {
            const amount = allTransaction
              .filter(tx => tx.type === 'income' && tx.category === category)
              .reduce((acc, tx) => acc + tx.amount, 0);

            return amount > 0 && (
              <div className="card mb-2" key={category}>
                <div className="card-body">
                  <h5>{category}</h5>
                  <Progress percent={((amount / totalIncomeTurnover) * 100).toFixed(0)} strokeColor="green" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-md-5 analytics-category">
          <h4 className="mb-3">Category-wise Expense</h4>
          {categories.map(category => {
            const amount = allTransaction
              .filter(tx => tx.type === 'expense' && tx.category === category)
              .reduce((acc, tx) => acc + tx.amount, 0);

            return amount > 0 && (
              <div className="card mb-2" key={category}>
                <div className="card-body">
                  <h5>{category}</h5>
                  <Progress percent={((amount / totalExpenseTurnover) * 100).toFixed(0)} strokeColor="red" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Analytics;
