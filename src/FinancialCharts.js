import React from "react";
import { StandardChart } from "./components/Charts";

/**
 * Logic only for the read-only display of charts
 *
 * TODO
 * 1. Add in the ability to change the frequecy displayed
 * @param {*} param0
 * @returns
 */

export function FinancialCharts({ amounts, selectedAccounts }) {
  
  return (
    <div>
      {/* {amounts.length && selectedAccounts.map(account => <p className="flex justify-start px-2 py-1 text-gray-500 rounded-md m-1">{`${account.id} Current Account Value: ${getCurrentAccountValue()}`}</p>)
      } */}

      <StandardChart data={amounts} selectedAccounts={selectedAccounts}/>
    </div>
  );

  // function getCurrentAccountValue() {
  //   if (amounts.length) {
  //     return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amounts[amounts.length - 1].amount);
  //   } 
  // }
}
