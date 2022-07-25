import { AddAmountRecord } from "./AddAmountRecord";
import { FinancialCharts } from "../FinancialCharts";
import Investment from "./Investment";
import React from "react";

export default function AccountHistoryChart({ accounts, savings, investments, bank, selectedAccounts, setSavings }) {

  // eslint-disable-next-line
  const [savingsData,setSavingsData] = React.useState([]);
  
  const handleShowTrendLine = (e) => {
    e.preventDefault();
  };

  const handleShowInvestments = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <div
        // style={{ display: bank === selectedBucket ? "block" : "none" }}
      >
        <div>
          <FinancialCharts amounts={savings} selectedAccounts={selectedAccounts} />
          <AddAmountRecord accounts={accounts} savings={savings} setSavings={setSavingsData}/>
          <button
            onClick={handleShowTrendLine}
            className="bg-white hover:bg-neutral-100 text-gray-500 border-2 py-1 px-2 rounded m-1"
          >
            Show Trend Line
          </button>
          <button
            onClick={handleShowInvestments}
            className="bg-white hover:bg-neutral-100 text-gray-500 border-2 py-1 px-2 rounded m-1"
          >
            Show Investments
          </button>
          {investments &&
            investments
              .filter((entry) => entry.data().bank === bank)
              .map((investment, i) => (
                <Investment key={i} document={investment.data()} />
              ))}
        </div>
      </div>
    </>
  );
}
