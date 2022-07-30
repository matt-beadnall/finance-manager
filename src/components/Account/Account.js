import { AddAmountRecord } from "../AddAmountRecord/AddAmountRecord";
import Investment from "../Investment";
import React, { useMemo } from "react";
import { sortData } from "../../functions/data-processing/DataCalculations";
import { StandardChart } from "../Charts/Charts";

export default function Account({ setSavings, accounts, data, investments, bank, selectedAccounts }) {


  // combine each account into one object per date
  const sortedData = useMemo(() => sortData(data), [data]);

  // eslint-disable-next-line
  const [savingsData, setSavingsData] = React.useState([]);

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
          <StandardChart data={sortedData} selectedAccounts={selectedAccounts} />
          <AddAmountRecord accounts={accounts} savings={sortedData} setSavings={setSavingsData} />
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
