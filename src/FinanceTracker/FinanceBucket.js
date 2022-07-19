import React from "react";
import { FinancialCharts } from "../FinancialCharts";
import Investment from "../Investment/Investment";
import { AddAmountRecord } from "./AddAmountRecord";

export default function FinanceBucketChart({ location, savings, investments }) {
  const handleShowTrendLine = (e) => {
    e.preventDefault();
  };

  const handleShowInvestments = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <button className="flex hover:bg-red-50 justify-start border-2 px-2 py-1 rounded-md m-1">
        {location.data().description}
      </button>
      <FinancialCharts
        amounts={savings
          .filter((entry) => entry.data().bank === location.id)
          .map((entry) => entry.data())}
        bank={location.data()}
      />
      <AddAmountRecord />
      <button
        onClick={handleShowTrendLine}
        className="bg-neutral-400 hover:bg-neutral-500 text-white py-1 px-2 rounded"
      >
        Show Trend Line
      </button>
      <button
        onClick={handleShowInvestments}
        className="bg-zinc-400 hover:bg-zinc-500 text-white py-1 px-2 rounded"
      >
        Show Investments
      </button>
      {investments &&
        investments
          .filter((entry) => entry.data().bank === location.id)
          .map((investment, i) => (
            <Investment key={i} document={investment.data()} />
          ))}
    </div>
  );
}
